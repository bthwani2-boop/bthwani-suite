'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthCard, BthKeyValueList, BthStateView, BthText, useDshControlPanelText, useUiText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { getSheinProxyRequestById, type SheinProxyRequestStatus } from './sheinproxy-fixtures';

type SheinProxyRequestStage = 'detail' | 'estimate' | 'offer' | 'schedule';
type SheinProxyRequestScreenState = 'ready' | 'loading' | 'empty' | 'offline' | 'disabled' | 'error';

export type ControlPanelDshSheinProxyRequestScreenProps = {
  requestId: string;
  stage: SheinProxyRequestStage;
  state?: SheinProxyRequestScreenState;
  listHref?: string;
  hubHref?: string;
  operationsHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function resolveStatusTone(status: SheinProxyRequestStatus) {
  if (status === 'cancelled') {
    return 'danger' as const;
  }

  if (status === 'approved' || status === 'scheduled') {
    return 'best' as const;
  }

  return 'neutral' as const;
}

function resolveStatusLabel(text: ReturnType<typeof useDshControlPanelText>, status: SheinProxyRequestStatus) {
  return text.sheinProxyRequest.statusLabels[
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
  state: Exclude<SheinProxyRequestScreenState, 'ready'>,
) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.sheinProxyRequest.stateLoadingTitle,
      description: text.sheinProxyRequest.stateLoadingDescription,
      actionLabel: text.sheinProxyRequest.retryLabel,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'notFound' as const,
      title: text.sheinProxyRequest.stateEmptyTitle,
      description: text.sheinProxyRequest.stateEmptyDescription,
      actionLabel: text.sheinProxyRequest.backToList,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.sheinProxyRequest.stateOfflineTitle,
      description: text.sheinProxyRequest.stateOfflineDescription,
      actionLabel: text.sheinProxyRequest.retryLabel,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.sheinProxyRequest.stateDisabledTitle,
      description: text.sheinProxyRequest.stateDisabledDescription,
      actionLabel: text.sheinProxyRequest.backToList,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.sheinProxyRequest.stateErrorTitle,
    description: text.sheinProxyRequest.stateErrorDescription,
    actionLabel: text.sheinProxyRequest.retryLabel,
  };
}

function resolveStageMeta(text: ReturnType<typeof useDshControlPanelText>, stage: SheinProxyRequestStage) {
  return {
    label: text.sheinProxyRequest.stageLabels[stage],
    description: text.sheinProxyRequest.stageDescriptions[stage],
  };
}

function resolveStageActions(requestId: string, stage: SheinProxyRequestStage, listHref: string, hubHref: string) {
  const baseHref = `/operations/dsh/sheinproxy/${requestId}`;

  if (stage === 'estimate') {
    return {
      primaryHref: `${baseHref}/offer`,
      primaryLabelKey: 'openOffer' as const,
      secondaryHref: baseHref,
      secondaryLabelKey: 'openDetail' as const,
      tertiaryHref: listHref,
      tertiaryLabelKey: 'backToList' as const,
      quaternaryHref: hubHref,
      quaternaryLabelKey: 'openHub' as const,
    };
  }

  if (stage === 'offer') {
    return {
      primaryHref: `${baseHref}/schedule`,
      primaryLabelKey: 'openSchedule' as const,
      secondaryHref: baseHref,
      secondaryLabelKey: 'openDetail' as const,
      tertiaryHref: listHref,
      tertiaryLabelKey: 'backToList' as const,
      quaternaryHref: hubHref,
      quaternaryLabelKey: 'openHub' as const,
    };
  }

  if (stage === 'schedule') {
    return {
      primaryHref: baseHref,
      primaryLabelKey: 'openDetail' as const,
      secondaryHref: listHref,
      secondaryLabelKey: 'backToList' as const,
      tertiaryHref: hubHref,
      tertiaryLabelKey: 'openHub' as const,
      quaternaryHref: `${baseHref}/estimate`,
      quaternaryLabelKey: 'openEstimate' as const,
    };
  }

  return {
    primaryHref: `${baseHref}/estimate`,
    primaryLabelKey: 'openEstimate' as const,
    secondaryHref: listHref,
    secondaryLabelKey: 'backToList' as const,
    tertiaryHref: hubHref,
    tertiaryLabelKey: 'openHub' as const,
    quaternaryHref: `${baseHref}/offer`,
    quaternaryLabelKey: 'openOffer' as const,
  };
}

export function ControlPanelDshSheinProxyRequestScreen({
  requestId,
  stage,
  state = 'ready',
  listHref = '/operations/dsh/sheinproxy',
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshSheinProxyRequestScreenProps) {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = useDshControlPanelText();
  const requestText = dshText.sheinProxyRequest;
  const request = getSheinProxyRequestById(requestId);
    const openSupportLabel = 'openSupport' in dshText
      ? String(dshText.openSupport)
      : String(dshText.common.openSupport);
  const resolvedState = state === 'ready' && !request ? 'empty' : state;
  const stageMeta = resolveStageMeta(dshText, stage);

  if (resolvedState !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, resolvedState);

    return (
      <BthWebPageFrame
        eyebrow={requestText.pageEyebrow}
        title={`${requestText.pageTitlePrefix} ${requestId}`}
        description={requestText.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <BthStateView
          {...stateCopy}
          onActionPress={() => {
            if (resolvedState === 'loading' || resolvedState === 'offline' || resolvedState === 'error') {
              router.refresh();
              return;
            }

            router.push(listHref);
          }}
        />
      </BthWebPageFrame>
    );
  }

  if (!request) {
    return null;
  }

  const stageActions = resolveStageActions(request.id, stage, listHref, hubHref);
  const statusLabel = resolveStatusLabel(dshText, request.status);
  const statusTone = resolveStatusTone(request.status);

  return (
    <BthWebPageFrame
      eyebrow={requestText.pageEyebrow}
      title={`${requestText.pageTitlePrefix} ${request.id}`}
      description={`${requestText.pageDescription} · ${stageMeta.label}`}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <BthBox gap={4}>
        <BthWebMissionHeroCard
          badges={[request.id, statusLabel, stageMeta.label]}
          eyebrow={requestText.heroEyebrow}
          title={request.customer}
          description={`${request.product} · ${stageMeta.description}`}
          metaItems={[
            `${requestText.amountLabel}: ${request.total}`,
            `${requestText.updatedLabel}: ${request.updated}`,
            `${requestText.quantityLabel}: ${request.quantity}`,
          ]}
          primaryAction={{ label: requestText[stageActions.primaryLabelKey], href: stageActions.primaryHref }}
          secondaryAction={{ label: requestText[stageActions.secondaryLabelKey], href: stageActions.secondaryHref }}
        />

        <BthBox layoutDirection="row" gap={2}>
          <BthWebSignalCard title={requestText.statusLabel} value={statusLabel} description={requestText.stageDescriptions[stage]} tone={statusTone} />
          <BthWebSignalCard title={requestText.amountLabel} value={request.amount} description={requestText.pricingDescription} />
          <BthWebSignalCard title={requestText.totalLabel} value={request.total} description={requestText.timelineDescription} tone="best" />
          <BthWebSignalCard title={requestText.nextActionLabel} value={stageMeta.label} description={stageMeta.description} />
        </BthBox>

        <BthWebSectionCard title={requestText.identityTitle} description={requestText.identityDescription}>
          <BthBox gap={2}>
            <BthCard>
              <BthKeyValueList
                items={[
                  { label: requestText.requestLabel, value: request.id },
                  { label: requestText.customerLabel, value: request.customer },
                  { label: requestText.productLabel, value: request.product },
                  { label: requestText.quantityLabel, value: String(request.quantity) },
                  { label: requestText.updatedLabel, value: request.updated },
                ]}
              />
            </BthCard>
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard title={requestText.pricingTitle} description={requestText.pricingDescription}>
          <BthBox gap={2}>
            <BthCard>
              <BthKeyValueList
                items={[
                  { label: requestText.amountLabel, value: request.amount },
                  { label: requestText.shippingLabel, value: request.shipping },
                  { label: requestText.serviceFeeLabel, value: request.fee },
                  { label: requestText.totalLabel, value: request.total, tone: 'success' },
                  { label: requestText.noteLabel, value: request.note },
                ]}
              />
            </BthCard>
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard title={requestText.nextStepTitle} description={requestText.nextStepDescription}>
          <BthBox gap={2}>
            <BthCard>
              <BthBox gap={2}>
                <BthText role="bodyStrong">{stageMeta.label}</BthText>
                <BthText role="bodySm" tone="muted">{stageMeta.description}</BthText>
                <BthText role="bodySm">{request.note}</BthText>
              </BthBox>
            </BthCard>
            <BthBox layoutDirection="row" gap={2}>
              <BthButton label={requestText[stageActions.primaryLabelKey]} tone="primary" fullWidth={false} onPress={() => router.push(stageActions.primaryHref)} />
              <BthButton label={requestText[stageActions.secondaryLabelKey]} tone="secondary" fullWidth={false} onPress={() => router.push(stageActions.secondaryHref)} />
              <BthButton label={requestText[stageActions.tertiaryLabelKey]} tone="secondary" fullWidth={false} onPress={() => router.push(stageActions.tertiaryHref)} />
              <BthButton label={requestText[stageActions.quaternaryLabelKey]} tone="ghost" fullWidth={false} onPress={() => router.push(stageActions.quaternaryHref)} />
              <BthButton label={requestText.backToList} tone="secondary" fullWidth={false} onPress={() => router.push(listHref)} />
              <BthButton label={requestText.openOperations} tone="secondary" fullWidth={false} onPress={() => router.push(operationsHref)} />
                <BthButton label={openSupportLabel} tone="secondary" fullWidth={false} onPress={() => router.push(supportHref)} />
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      </BthBox>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshSheinProxyRequestScreen;

