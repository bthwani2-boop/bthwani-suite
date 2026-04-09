// Wlt settlements list - Screen for wlt_settlements_list operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalListScreen, type ListAdapter, type ListItem } from '@bthwani/surfaces/core/shared/lists';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_SETTLEMENTS_LIST() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_settlements_list',
    entityType: 'settlements',
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
      title: t('web.control panel.finance.WLT_SETTLEMENTS_LIST.settlementsList'),
      subtitle: t('web.control panel.finance.WLT_SETTLEMENTS_LIST.manageAllSettlements'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        list: '/api/wlt/settlements',
      },
    },
  };

  const adapter: ListAdapter = {
    transformIncomingData: (rawData: unknown): ListItem[] => {
      const data = rawData as any;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id || item.settlement_id || String(item.id),
          title: item.title || item.description || `تسوية ${item.id || item.settlement_id}`,
          subtitle: item.status || item.created_at || '',
          status: item.status || 'pending',
          metadata: item,
        }));
      }
      if (data?.items && Array.isArray(data.items)) {
        return data.items.map((item: any) => ({
          id: item.id || item.settlement_id || String(item.id),
          title: item.title || item.description || `تسوية ${item.id || item.settlement_id}`,
          subtitle: item.status || item.created_at || '',
          status: item.status || 'pending',
          metadata: item,
        }));
      }
      return [];
    },
    transformOutgoingData: (data: unknown): unknown => {
      return data;
    },
    validateData: (data: unknown): boolean => {
      return Array.isArray(data) || (typeof data === 'object' && data !== null && Array.isArray((data as any).items));
    },
    getSupportedFeatures: (): string[] => {
      return ['search', 'filter', 'sort', 'pagination', 'refresh'];
    },
    getDefaultConfiguration: (): unknown => {
      return {};
    },
    getDisplayLabels: (): Record<string, string> => {
      return {
        id: 'المعرف',
        status: 'الحالة',
        amount: 'المبلغ',
        created_at: 'تاريخ الإنشاء',
      };
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


