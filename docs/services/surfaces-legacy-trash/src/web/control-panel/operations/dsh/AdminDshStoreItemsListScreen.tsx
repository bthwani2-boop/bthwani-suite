import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalListScreen, type ListAdapter, type ListItem } from '@bthwani/surfaces/shared/lists';
import { useI18n } from '@bthwani/ui-kit';

export interface AdminDshStoreItemsListScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalListScreenComponent: React.ElementType;
}

export const AdminDshStoreItemsListScreen: React.FC<AdminDshStoreItemsListScreenProps> = ({
  StateManagerComponent,
  UniversalListScreenComponent,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'dsh' as const,
    operationId: 'dsh_stores_by_store_id_products_get',
    entityType: 'STORE_ITEMS_DSHSTORESBYSTOREIDPRODUCTSGET',
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
      title: t('web.control panel.operations.dsh.AdminDshStoreItemsListScreen.storeProductsList'),
      subtitle: t('web.control panel.operations.dsh.AdminDshStoreItemsListScreen.manageDshStoreProducts'),
    },
    api: {
      baseUrl: '/api/dsh',
      endpoints: {
        list: 'dsh/store/{storeId}/products',
      },
    },
  };

  const adapter: ListAdapter = {
    transformIncomingData: (rawData: unknown): ListItem[] => {
      return (rawData as any)?.products || (Array.isArray(rawData) ? rawData : []);
    },
    transformOutgoingData: (data: unknown): unknown => {
      return data;
    },
    validateData: (data: unknown): boolean => {
      return Array.isArray(data) || (typeof data === 'object' && data !== null && 'products' in data);
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
    <StateManagerComponent config={config}>
      <UniversalListScreenComponent config={config} adapter={adapter} />
    </StateManagerComponent>
  );
};

