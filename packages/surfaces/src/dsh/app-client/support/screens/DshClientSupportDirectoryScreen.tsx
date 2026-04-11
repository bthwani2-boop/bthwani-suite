import React from 'react';
import { BthBox, BthListItem, BthMobileScrollView, BthSectionHeader, BthStatCard, BthSurface, BthText } from '@bthwani/ui-kit';
import { clientSupportDefinitions, clientSupportDirectoryGroups, type ClientSupportScreenId } from './DshClientGeneratedSupportScreens';

export type DshClientSupportDirectoryScreenProps = {
  onOpenScreen?: (screenId: ClientSupportScreenId) => void;
};

export function DshClientSupportDirectoryScreen({ onOpenScreen }: DshClientSupportDirectoryScreenProps) {
  const supportScreenCount = Object.keys(clientSupportDefinitions).length;

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">DSH client capability library</BthText>
        <BthText role="bodyMd" tone="muted">
          Internal capability library for residual DSH client flows, grouped by customer journey instead of a flat fallback bucket.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthStatCard label="Covered capabilities" value={String(supportScreenCount)} deltaLabel="Documented internal client matrix" tone="info" />
        <BthStatCard label="Navigation model" value="Grouped" deltaLabel="Intake, checkout, delivery, benefits, proxy" tone="success" />
      </BthSurface>

      {clientSupportDirectoryGroups.map((group) => (
        <BthSurface key={group.title} tone="raised" gap={3}>
          <BthSectionHeader title={group.title} subtitle={group.subtitle} />
          <BthBox gap={2}>
            {group.itemIds.map((itemId) => {
              const item = clientSupportDefinitions[itemId];

              return (
                <BthListItem
                  key={itemId}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.stageLabel}
                  badgeLabel={item.badgeLabel}
                  onPress={() => onOpenScreen?.(itemId)}
                />
              );
            })}
          </BthBox>
        </BthSurface>
      ))}
    </BthMobileScrollView>
  );
}

export default DshClientSupportDirectoryScreen;