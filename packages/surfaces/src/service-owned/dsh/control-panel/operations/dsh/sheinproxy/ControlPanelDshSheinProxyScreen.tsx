'use client';

import { useDshControlPanelText } from '../shared/dshControlPanelText';

import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'next/navigation';
import { useDirection } from '@bthwani/ui-kit';
import {
  BthBadge,
  BthBox,
  BthButton,
  BthCard,
  BthDataTable,
  BthKeyValueList,
  BthStateView,
  BthStatCard,
  BthText,
  BthWebCommandCenterFrame,
  BthWebSectionCard,
  useUiText
} from '@bthwani/ui-kit';
import { getSheinProxyRequests, type SheinProxyRequest, type SheinProxyRequestStatus } from './sheinproxy-fixtures';

export type ControlPanelDshSheinProxyScreenState = 'ready' | 'loading' | 'empty' | 'offline' | 'disabled' | 'error';

export type ControlPanelDshSheinProxyScreenProps = {
  state?: ControlPanelDshSheinProxyScreenState;
  hubHref?: string;
  operationsHref?: string;
  supportHref?: string;
};

const FILTER_IDS = ['all', 'under-review', 'estimated', 'offered', 'scheduled', 'approved', 'cancelled'] as const;

type SheinProxyFilterId = (typeof FILTER_IDS)[number];

function resolveStatusTone(status: SheinProxyRequestStatus) {
  if (status === 'cancelled') {
    return 'danger' as const;
  }

  if (status === 'approved' || status === 'scheduled') {
    return 'success' as const;
  }

  if (status === 'offered') {
    return 'brand' as const;
  }

  if (status === 'estimated') {
    return 'info' as const;
  }

  return 'warning' as const;
}

function resolveStatusLabel(text: ReturnType<typeof useDshControlPanelText>, status: SheinProxyRequestStatus) {
  return text.sheinProxy.statusLabels[
    status === 'under-review'
      ? 'underReview'
      : status === 'estimated'
        ? 'estimated'
        : status === 'offered'
          ? 'offered'
          : status === 'scheduled'
            ? 'scheduled'
            : status === 'approved'
              ? 'approved'
              : 'cancelled'
  ];
}

function resolveNextActionLabel(text: ReturnType<typeof useDshControlPanelText>, status: SheinProxyRequestStatus) {
  return text.sheinProxy.nextActionLabels[
    status === 'under-review'
      ? 'underReview'
      : status === 'estimated'
        ? 'estimated'
        : status === 'offered'
          ? 'offered'
          : status === 'scheduled'
            ? 'scheduled'
            : status === 'approved'
              ? 'approved'
              : 'cancelled'
  ];
}

function resolveStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ControlPanelDshSheinProxyScreenState, 'ready'>,
) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.sheinProxy.stateLoadingTitle,
      description: text.sheinProxy.stateLoadingDescription,
      actionLabel: text.sheinProxy.retryLabel,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.sheinProxy.stateEmptyTitle,
      description: text.sheinProxy.stateEmptyDescription,
      actionLabel: text.sheinProxy.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.sheinProxy.stateOfflineTitle,
      description: text.sheinProxy.stateOfflineDescription,
      actionLabel: text.sheinProxy.retryLabel,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.sheinProxy.stateDisabledTitle,
      description: text.sheinProxy.stateDisabledDescription,
      actionLabel: text.sheinProxy.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.sheinProxy.stateErrorTitle,
    description: text.sheinProxy.stateErrorDescription,
    actionLabel: text.sheinProxy.retryLabel,
  };
}

function filterRequests(requests: readonly SheinProxyRequest[], filterId: SheinProxyFilterId) {
  if (filterId === 'all') {
    return requests;
  }

  return requests.filter((request) => request.status === filterId);
}

export function ControlPanelDshSheinProxyScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  supportHref = '/support',
}: ControlPanelDshSheinProxyScreenProps) {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = useDshControlPanelText();
  const { language } = useDirection();
  const requests = React.useMemo(() => getSheinProxyRequests(), []);
  const [activeFilterId, setActiveFilterId] = React.useState<SheinProxyFilterId>('all');
  const [selectedRequestId, setSelectedRequestId] = React.useState<string>(requests[0]?.id ?? '');

  const filteredRequests = React.useMemo(() => filterRequests(requests, activeFilterId), [activeFilterId, requests]);
  const selectedRequest = React.useMemo(() => {
    const matchingRequest = filteredRequests.find((request) => request.id === selectedRequestId);

    return matchingRequest ?? filteredRequests[0] ?? requests[0];
  }, [filteredRequests, requests, selectedRequestId]);

  const liveRequestCount = requests.length;
  const statusCounts = {
    all: requests.length,
    'under-review': requests.filter((request) => request.status === 'under-review').length,
    estimated: requests.filter((request) => request.status === 'estimated').length,
    offered: requests.filter((request) => request.status === 'offered').length,
    scheduled: requests.filter((request) => request.status === 'scheduled').length,
    approved: requests.filter((request) => request.status === 'approved').length,
    cancelled: requests.filter((request) => request.status === 'cancelled').length,
  } as const;

  const readyForSelection = state === 'ready';
  const activeFilterLabel =
    activeFilterId === 'all'
      ? dshText.sheinProxy.allRequestsLabel
      : resolveStatusLabel(
          dshText,
          activeFilterId === 'under-review'
            ? 'under-review'
            : activeFilterId === 'estimated'
              ? 'estimated'
              : activeFilterId === 'offered'
                ? 'offered'
                : activeFilterId === 'scheduled'
                  ? 'scheduled'
                  : activeFilterId === 'approved'
                    ? 'approved'
                    : 'cancelled',
        );

  const topFilters = FILTER_IDS.map((filterId) => ({
    id: filterId,
    label:
      filterId === 'all'
        ? dshText.sheinProxy.allRequestsLabel
        : resolveStatusLabel(
            dshText,
            filterId === 'under-review'
              ? 'under-review'
              : filterId === 'estimated'
                ? 'estimated'
                : filterId === 'offered'
                  ? 'offered'
                  : filterId === 'scheduled'
                    ? 'scheduled'
                    : filterId === 'approved'
                      ? 'approved'
                      : 'cancelled',
          ),
    metaLabel: String(statusCounts[filterId]),
    active: filterId === activeFilterId,
  }));

  const railItems = requests.map((request) => ({
    id: request.id,
    label: request.id,
    description: `${request.customer} · ${request.product}`,
    badge: resolveStatusLabel(dshText, request.status),
    active: request.id === selectedRequest?.id,
  }));

  const signalCards = [
    {
      label: dshText.sheinProxy.signals.pending,
      description: dshText.sheinProxy.signals.pendingDescription,
      value: String(statusCounts['under-review']),
      tone: 'warning' as const,
    },
    {
      label: dshText.sheinProxy.signals.estimated,
      description: dshText.sheinProxy.signals.estimatedDescription,
      value: String(statusCounts.estimated),
      tone: 'info' as const,
    },
    {
      label: dshText.sheinProxy.signals.offered,
      description: dshText.sheinProxy.signals.offeredDescription,
      value: String(statusCounts.offered),
      tone: 'brand' as const,
    },
    {
      label: dshText.sheinProxy.signals.scheduled,
      description: dshText.sheinProxy.signals.scheduledDescription,
      value: String(statusCounts.scheduled),
      tone: 'success' as const,
    },
  ] as const;

  const tableColumns = [
    {
      id: 'request',
      header: dshText.sheinProxy.requestLabel,
      renderCell: (row: SheinProxyRequest) => (
        <BthBox gap={1}>
          <BthText role="bodyStrong">{row.id}</BthText>
          <BthText role="caption" tone="soft">{row.product}</BthText>
        </BthBox>
      ),
    },
    {
      id: 'customer',
      header: dshText.sheinProxy.customerLabel,
      renderCell: (row: SheinProxyRequest) => row.customer,
    },
    {
      id: 'status',
      header: dshText.sheinProxy.statusLabel,
      renderCell: (row: SheinProxyRequest) => (
        <BthBadge label={resolveStatusLabel(dshText, row.status)} tone={resolveStatusTone(row.status)} />
      ),
    },
    {
      id: 'amount',
      header: dshText.sheinProxy.amountLabel,
      align: 'end' as const,
      renderCell: (row: SheinProxyRequest) => row.total,
    },
    {
      id: 'updated',
      header: dshText.sheinProxy.updatedLabel,
      align: 'end' as const,
      renderCell: (row: SheinProxyRequest) => row.updated,
    },
    {
      id: 'action',
      header: dshText.sheinProxy.nextActionLabel,
      align: 'end' as const,
      renderCell: (row: SheinProxyRequest) => (
        <BthButton
          label={dshText.sheinProxy.inspectRequest}
          size="sm"
          tone="secondary"
          fullWidth={false}
          onPress={() => setSelectedRequestId(row.id)}
        />
      ),
    },
  ] as const;

  const stateContent = readyForSelection ? null : (
    <BthStateView
      {...resolveStateCopy(dshText, state)}
      onActionPress={() => {
        if (state === 'error' || state === 'loading' || state === 'offline') {
          router.refresh();
          return;
        }

        router.push(hubHref);
      }}
    />
  );

  if (!readyForSelection) {
    return (
      <BthWebCommandCenterFrame
        brandLabel={uiText.controlPanel.brandLabel}
        surfaceTitle={dshText.sheinProxy.pageTitle}
        surfaceSubtitle={dshText.sheinProxy.pageDescription}
        topFilters={topFilters}
        onTopFilterSelect={(filterId) => setActiveFilterId(filterId as SheinProxyFilterId)}
        onBrandClick={() => router.push('/dashboard')}
        onSearchClick={() => router.push(operationsHref)}
        onRefreshClick={() => router.refresh()}
        onAlertClick={() => router.push(supportHref)}
        railTitle={dshText.sheinProxy.tableTitle}
        railStatusLabel={String(liveRequestCount)}
        railItems={railItems}
      >
        {stateContent}
      </BthWebCommandCenterFrame>
    );
  }

  return (
    <BthWebCommandCenterFrame
      brandLabel={uiText.controlPanel.brandLabel}
      surfaceTitle={dshText.sheinProxy.pageTitle}
      surfaceSubtitle={`${dshText.sheinProxy.pageDescription} · ${activeFilterLabel}`}
      topFilters={topFilters}
      onTopFilterSelect={(filterId) => {
        const nextFilterId = filterId as SheinProxyFilterId;
        setActiveFilterId(nextFilterId);
        const nextRequests = filterRequests(requests, nextFilterId);
        setSelectedRequestId(nextRequests[0]?.id ?? requests[0]?.id ?? '');
      }}
      onBrandClick={() => router.push('/dashboard')}
      onSearchClick={() => {
        setActiveFilterId('under-review');
        setSelectedRequestId(requests.find((request) => request.status === 'under-review')?.id ?? requests[0]?.id ?? '');
      }}
      onRefreshClick={() => router.refresh()}
      onAlertClick={() => {
        const targetRequest = requests.find((request) => request.status === 'scheduled') ?? requests[0];
        setActiveFilterId('scheduled');
        setSelectedRequestId(targetRequest?.id ?? '');
      }}
      railTitle={dshText.sheinProxy.tableTitle}
      railStatusLabel={String(filteredRequests.length)}
      railItems={railItems}
      onRailItemSelect={(itemId) => setSelectedRequestId(itemId)}
    >
      <BthBox gap={4}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {signalCards.map((signalCard) => (
            <View key={signalCard.label} style={{ flexBasis: 280, flexGrow: 1, minWidth: 240 }}>
              <BthStatCard
                label={signalCard.label}
                value={signalCard.value}
                deltaLabel={signalCard.description}
                tone={signalCard.tone}
              />
            </View>
          ))}
        </View>

        <BthWebSectionCard
          title={dshText.sheinProxy.tableTitle}
          description={dshText.sheinProxy.tableDescription}
        >
          <BthDataTable
            caption={dshText.sheinProxy.tableDescription}
            emptyTitle={dshText.sheinProxy.tableEmptyTitle}
            emptyDescription={dshText.sheinProxy.tableEmptyDescription}
            language={language}
            rows={filteredRequests}
            rowKey="id"
            columns={tableColumns}
          />
        </BthWebSectionCard>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexBasis: 360, flexGrow: 1, minWidth: 320 }}>
            <BthCard title={selectedRequest.id} subtitle={`${selectedRequest.customer} · ${selectedRequest.product}`}>
              <BthBox gap={3}>
                <BthKeyValueList
                  items={[
                    { label: dshText.sheinProxy.requestLabel, value: selectedRequest.id },
                    { label: dshText.sheinProxy.customerLabel, value: selectedRequest.customer },
                    { label: dshText.sheinProxy.productLabel, value: selectedRequest.product },
                    { label: dshText.sheinProxy.quantityLabel, value: String(selectedRequest.quantity) },
                    { label: dshText.sheinProxy.statusLabel, value: resolveStatusLabel(dshText, selectedRequest.status) },
                    { label: dshText.sheinProxy.updatedLabel, value: selectedRequest.updated },
                    { label: dshText.sheinProxy.nextActionLabel, value: resolveNextActionLabel(dshText, selectedRequest.status) },
                  ]}
                />
              </BthBox>
            </BthCard>
          </View>

          <View style={{ flexBasis: 360, flexGrow: 1, minWidth: 320 }}>
            <BthCard title={dshText.sheinProxy.pricingTitle} subtitle={selectedRequest.note}>
              <BthBox gap={3}>
                <BthKeyValueList
                  items={[
                    { label: dshText.sheinProxy.amountLabel, value: selectedRequest.amount },
                    { label: dshText.sheinProxy.shippingLabel, value: selectedRequest.shipping },
                    { label: dshText.sheinProxy.serviceFeeLabel, value: selectedRequest.fee },
                    { label: dshText.sheinProxy.totalLabel, value: selectedRequest.total, tone: 'success' },
                    {
                      label: dshText.sheinProxy.notesLabel,
                      value: selectedRequest.note,
                      helperText: resolveNextActionLabel(dshText, selectedRequest.status),
                    },
                  ]}
                />

                <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <BthButton
                    label={dshText.sheinProxy.retryLabel}
                    tone="ghost"
                    fullWidth={false}
                    onPress={() => router.refresh()}
                  />
                  <BthButton
                    label={dshText.common.openGeneralOperations}
                    tone="primary"
                    fullWidth={false}
                    onPress={() => router.push(operationsHref)}
                  />
                  <BthButton
                    label={dshText.sheinProxy.backToHub}
                    tone="secondary"
                    fullWidth={false}
                    onPress={() => router.push(hubHref)}
                  />
                  <BthButton
                    label={dshText.common.openSupport}
                    tone="secondary"
                    fullWidth={false}
                    onPress={() => router.push(supportHref)}
                  />
                </BthBox>
              </BthBox>
            </BthCard>
          </View>
        </View>
      </BthBox>
    </BthWebCommandCenterFrame>
  );
}

export default ControlPanelDshSheinProxyScreen;
