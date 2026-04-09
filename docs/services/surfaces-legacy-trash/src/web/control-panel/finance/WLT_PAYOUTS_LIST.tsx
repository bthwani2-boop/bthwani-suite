// WLT payouts list - Screen for wlt_payouts_list operation in WLT service (CONTROL PANEL)

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalListScreen, type ListAdapter, type ListItem } from '@bthwani/surfaces/core/shared/lists';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_PAYOUTS_LIST() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_payouts_list',
    entityType: 'payouts',
    entityId: '',
    features: {
      search: true,
      filter: true,
      sort: true,
      pagination: true,
      refresh: true,
      bulkActions: false,
    },
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_PAYOUTS_LIST.payoutsList'),
      subtitle: t('web.control panel.finance.WLT_PAYOUTS_LIST.managePartnerPayouts'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        list: '/api/wlt/payouts',
      },
    },
  };

  const adapter: ListAdapter = {
    transformIncomingData: (rawData: unknown): ListItem[] => {
      const data = rawData as any;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id || item.payout_id || String(item.id),
          title: item.title || item.description || `دفعة ${item.id || item.payout_id}`,
          subtitle: item.status || item.created_at || '',
          status: item.status || 'pending',
          metadata: item,
        }));
      }
      if (data?.items && Array.isArray(data.items)) {
        return data.items.map((item: any) => ({
          id: item.id || item.payout_id || String(item.id),
          title: item.title || item.description || `دفعة ${item.id || item.payout_id}`,
          subtitle: item.status || item.created_at || '',
          status: item.status || 'pending',
          metadata: item,
        }));
      }
      return [];
    },
    transformOutgoingData: (data: unknown): unknown => data,
    validateData: (data: unknown): boolean =>
      Array.isArray(data) || (typeof data === 'object' && data !== null && Array.isArray((data as any).items)),
    getSupportedFeatures: (): string[] => ['search', 'filter', 'sort', 'pagination', 'refresh'],
    getDefaultConfiguration: (): unknown => ({}),
    getDisplayLabels: (): Record<string, string> => ({
      id: t('surfaces.المعرف'),
      status: 'الحالة',
      amount: 'المبلغ',
      created_at: t('surfaces.تاريخ_الإنشاء'),
    }),
    getValidationMessages: (): Record<string, string> => ({}),
  };

  return (
    <StateManager config={config}>
      <UniversalListScreen config={config} adapter={adapter} />
    </StateManager>
  );
}

