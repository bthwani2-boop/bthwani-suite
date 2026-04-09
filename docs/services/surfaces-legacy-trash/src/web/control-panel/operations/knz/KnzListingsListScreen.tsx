/**
 * CONTROL PANEL — قائمة إعلانات KNZ للإدارة
 * مرجع: KNZ_EXECUTION_ROADMAP_CHECKLIST §3.3 (operations/knz — قائمة)
 * العملية: knz_listings_list | GET /api/knz/listings
 */

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import type { ListAdapter, ListItem } from '@bthwani/surfaces/shared/lists';
import { useI18n } from '@bthwani/ui-kit';

export interface KnzListingsListScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalListScreenComponent: React.ElementType;
}

export const KnzListingsListScreen: React.FC<KnzListingsListScreenProps> = ({
  StateManagerComponent,
  UniversalListScreenComponent,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'knz' as const,
    operationId: 'knz_listings_list',
    entityType: 'LISTINGS_KNZLISTINGSLIST',
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
      title: t('web.control panel.operations.knz.KnzListingsListScreen.knzListingsList'),
      subtitle: t('web.control panel.operations.knz.KnzListingsListScreen.manageKnzListings'),
    },
    api: {
      baseUrl: '/api/knz',
      endpoints: {
        list: 'listings',
      },
    },
  };

  const adapter: ListAdapter = {
    transformIncomingData: (rawData: unknown): ListItem[] => {
      const data = rawData as { items?: unknown[]; listings?: unknown[] };
      return data?.items ?? data?.listings ?? (Array.isArray(rawData) ? rawData : []);
    },
    transformOutgoingData: (data: unknown): unknown => data,
    validateData: (data: unknown): boolean =>
      Array.isArray(data) || (typeof data === 'object' && data !== null && ('items' in data || 'listings' in data)),
    getSupportedFeatures: (): string[] => ['search', 'filter', 'sort', 'pagination'],
    getDefaultConfiguration: (): unknown => ({}),
    getDisplayLabels: (): Record<string, string> => ({}),
    getValidationMessages: (): Record<string, string> => ({}),
  };

  return (
    <StateManagerComponent config={config}>
      <UniversalListScreenComponent config={config} adapter={adapter} />
    </StateManagerComponent>
  );
};

