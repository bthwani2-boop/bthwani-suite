import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalListScreen, type ListAdapter, type ListItem } from '@bthwani/surfaces/core/shared/lists';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_SUPPORT_ARBPARTNERBOOKINGSLIST() {
  const { t } = useI18n();
  const config = {
    service: 'arb' as const,
    entityType: "SUPPORT_ARBPARTNERBOOKINGSLIST",
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
      title: t('web.control panel.support.APP_SUPPORT_ARBPARTNERBOOKINGSLIST.arbPartnerBookings'),
      subtitle: t('web.control panel.support.APP_SUPPORT_ARBPARTNERBOOKINGSLIST.screenForArb'),
    },
    api: {
      baseUrl: '/api/arb',
      endpoints: {
        list: 'arb/partner/bookings/list',
      },
    },
  };

  const adapter: ListAdapter = {
    transformIncomingData: (rawData: unknown): ListItem[] => {
      return (rawData as any)?.items || (Array.isArray(rawData) ? rawData : []);
    },
    transformOutgoingData: (data: unknown): unknown => {
      return data;
    },
    validateData: (data: unknown): boolean => {
      return Array.isArray(data);
    },
    getSupportedFeatures: (): string[] => {
      return ['search', 'filter', 'sort', 'pagination'];
    },
    getDefaultConfiguration: (): unknown => {
      return {};
    },
    getDisplayLabels: (): Record<string, string> => {
      return {};
    },
    getValidationMessages: (): Record<string, string> => {
      return {};
    },
  };

  return (
    <StateManager config={config}>
      <UniversalListScreen config={config} adapter={adapter} />
    </StateManager>
  );
}


