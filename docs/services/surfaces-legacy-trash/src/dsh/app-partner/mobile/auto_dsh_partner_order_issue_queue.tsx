import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  useI18n,
} from '@bthwani/ui-kit';
import {
  getDshPartnerOrdersList,
  type DshPartnerOrdersListItem,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import {
  buildPartnerIssueQueueFixture,
  type PartnerIssueQueueFixtureItem,
} from '../../fixtures/partnerStaff';

type IssueSeverity = 'high' | 'medium' | 'low';
type IssueStatus = 'open' | 'in_progress' | 'resolved';

type IssueItem = {
  id: string;
  orderId: string;
  title: string;
  severity: IssueSeverity;
  status: IssueStatus;
  createdAt: string;
};

function mapOrderToIssue(order: DshPartnerOrdersListItem): IssueItem | null {
  const status = String(order.status ?? '').trim();
  if (!status) return null;

  if (status === 'rejected' || status === 'cancelled') {
    return {
      id: `issue-${order.id}`,
      orderId: order.id,
      title: 'Order rejected/cancelled',
      severity: 'high',
      status: 'open',
      createdAt: order.created_at,
    };
  }

  if (status === 'out_for_delivery') {
    return {
      id: `issue-${order.id}`,
      orderId: order.id,
      title: 'Potential delivery delay',
      severity: 'medium',
      status: 'in_progress',
      createdAt: order.created_at,
    };
  }

  return null;
}

function mapFixtureIssue(item: PartnerIssueQueueFixtureItem): IssueItem {
  return {
    id: item.id,
    orderId: item.orderId,
    title: item.title,
    severity: item.severity,
    status: item.status,
    createdAt: item.createdAt,
  };
}

export const AutoDshPartnerOrderIssueQueue: React.FC = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const [state, setState] = useState<ScreenState>('loading');
  const [issues, setIssues] = useState<IssueItem[]>([]);

  const load = useCallback(async () => {
    setState('loading');
    try {
      const orders = await getDshPartnerOrdersList();
      const derived = orders
        .map(mapOrderToIssue)
        .filter((v): v is IssueItem => v !== null);
      if (derived.length > 0) {
        setIssues(derived);
        setState('content');
        return;
      }
      setIssues(buildPartnerIssueQueueFixture().map(mapFixtureIssue));
      setState('content');
    } catch {
      setIssues(buildPartnerIssueQueueFixture().map(mapFixtureIssue));
      setState('content');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state='loading'
        loadingMessage={t(
          'dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.loadingMessage'
        )}
        screenName='auto_dsh_partner_order_issue_queue'
        operationName='dsh_partner_order_issue_queue'
      />
    );
  }

  const openCount = issues.filter((i) => i.status === 'open').length;
  const highCount = issues.filter((i) => i.severity === 'high').length;

  return (
    <ScreenWrapper state='content'>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, textAlignStart]}>
          {t('dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.title')}
        </Text>

        <View style={styles.cardsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{issues.length}</Text>
            <Text style={styles.metricLabel}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.totalIssues'
              )}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{openCount}</Text>
            <Text style={styles.metricLabel}>
              {t('dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.open')}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{highCount}</Text>
            <Text style={styles.metricLabel}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.highPriority'
              )}
            </Text>
          </View>
        </View>

        {issues.map((item) => (
          <View key={item.id} style={styles.rowCard}>
            <Text style={[styles.rowTitle, textAlignStart]}>
              {t('dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.orderId', {
                orderId: item.orderId,
              })}
            </Text>
            <Text style={[styles.rowMeta, textAlignStart]}>{item.title}</Text>
            <Text style={[styles.rowMeta, textAlignStart]}>
              {t(
                `dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.severity.${item.severity}`
              )}{' '}
              -{' '}
              {t(
                `dsh.app-partner.mobile.auto_dsh_partner_order_issue_queue.status.${item.status}`
              )}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  cardsRow: { flexDirection: 'row', gap: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.lg },
  metricCard: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  metricValue: { fontSize: 22, fontWeight: '700', color: semanticRoles.onSurface },
  metricLabel: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  rowCard: {
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    marginBottom: BTHWANI_SPACING.sm,
  },
  rowTitle: { fontSize: 14, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs },
  rowMeta: { fontSize: 12, color: semanticRoles.onSurfaceMuted },
});

export default AutoDshPartnerOrderIssueQueue;
