import React from 'react';

export interface FormField {
  key: string;
  name?: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    maxLength?: number;
  };
}

export interface FormAdapter {
  validateField?: (
    field: FormField,
    value: unknown
  ) => { valid: boolean; error?: string };
  transformOutgoingData?: (data: Record<string, unknown>) => unknown;
  getFieldLabels?: () => Record<string, string>;
  getValidationMessages?: () => Record<string, string>;
  [key: string]: unknown;
}

export interface UniversalFormScreenProps {
  config: {
    service: string;
    operationId?: string;
    entityType: string;
    entityId: string;
    fields?: FormField[];
    styling: {
      primaryColor: string;
      secondaryColor?: string;
      title: string;
      subtitle: string;
    };
    actions: {
      submit: { label: string; disabled?: boolean };
      cancel?: { label: string };
    };
    api: {
      baseUrl: string;
      endpoints: Record<string, string>;
    };
  };
  adapter?: FormAdapter;
}

export const UniversalFormScreen: React.FC<UniversalFormScreenProps> = ({
  config,
  adapter,
}) => {
  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white shadow-lg rounded-lg p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {config.styling.title}
          </h1>
          <p className='text-gray-600 mb-6'>{config.styling.subtitle}</p>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-blue-900 mb-2'>
              Universal Form Screen
            </h3>
            <div className='text-sm text-blue-700'>
              <p>
                <strong>Service:</strong> {config.service}
              </p>
              <p>
                <strong>Operation:</strong> {config.operationId || 'N/A'}
              </p>
              <p>
                <strong>Entity:</strong> {config.entityType}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className='text-green-600'>Ready for implementation</span>
              </p>
            </div>
          </div>

          <div className='mt-6'>
            <p className='text-sm text-gray-500'>
              This is a placeholder implementation. The actual form
              functionality will be implemented based on the operation
              requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useFormAdapter = (service: string): FormAdapter => {
  return {
    service,
    submit: async (data: unknown) => {
      // Placeholder implementation
      return { kind: 'success' as const };
    },
    validate: (data: unknown) => {
      // Placeholder validation
      return { valid: true, errors: [] };
    },
  };
};
