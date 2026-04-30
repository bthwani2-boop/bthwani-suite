import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalListScreen, type ListAdapter, type ListItem } from '@bthwani/surfaces/core/shared/lists';

export default function MCPW_AUDIT_LOGS_LIST() {
  const config = {
    service: 'control panel' as const,
    entityType: "MCPW_AUDIT_LOGS_LIST",
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
      title: 'Audit logs list',
      subtitle: 'Screen for Audit logs list operation in CONTROL PANEL service',
    },
    api: {
      baseUrl: '/api/control panel',
      endpoints: {
        list: 'control panel/audit/logs',
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


