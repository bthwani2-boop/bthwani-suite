import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalListScreen, type ListAdapter, type ListItem } from '@bthwani/surfaces/shared/lists';
import { useI18n } from '@bthwani/ui-kit';

export interface CancelHrJobsListScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalListScreenComponent: React.ElementType;
}

export const CancelHrJobsListScreen: React.FC<CancelHrJobsListScreenProps> = ({
  StateManagerComponent,
  UniversalListScreenComponent,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'hr' as const,
    entityType: "CANCEL_HRJOBSLIST",
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
      title: t('web.control panel.operations.hr.CancelHrJobsListScreen.jobsList'),
      subtitle: t('web.control panel.operations.hr.CancelHrJobsListScreen.viewHrJobs'),
    },
    api: {
      baseUrl: '/api/hr',
      endpoints: {
        list: 'hr/jobs/list',
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
    <StateManagerComponent config={config}>
      <UniversalListScreenComponent config={config} adapter={adapter} />
    </StateManagerComponent>
  );
};

