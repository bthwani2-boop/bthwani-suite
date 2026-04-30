'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

export interface UniversalHubScreenProps {
  config: {
    service: string;
    operationId?: string;
    entityType: string;
    entityId: string;
    styling: {
      primaryColor: string;
      secondaryColor: string;
      title: string;
      subtitle: string;
    };
    api: {
      baseUrl: string;
      endpoints: Record<string, string>;
    };
  };
}

export const UniversalHubScreen: React.FC<UniversalHubScreenProps> = ({
  config,
}) => {
  const { t } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine which endpoint to use
        const endpoint =
          config.api.endpoints.get ||
          config.api.endpoints.patch ||
          config.api.endpoints.post;
        if (!endpoint) {
          setError(t('surfaces.No_endpoint_configured'));
          setLoading(false);
          return;
        }

        // Build full URL
        const baseUrl = config.api.baseUrl.startsWith('http')
          ? config.api.baseUrl
          : `${typeof window !== 'undefined' ? window.location.origin : ''}${config.api.baseUrl}`;

        const fullUrl = `${baseUrl}/${endpoint}`;

        // Determine HTTP method
        let method = 'GET';
        if (config.api.endpoints.patch) method = 'PATCH';
        else if (config.api.endpoints.post) method = 'POST';
        else if (config.api.endpoints.put) method = 'PUT';

        // Fetch data
        const response = await rawFetch(fullUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        console.error('UniversalHubScreen fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config]);

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white shadow-lg rounded-lg p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {config.styling.title}
          </h1>
          <p className='text-gray-600 mb-6'>{config.styling.subtitle}</p>

          {loading && (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <span className='ml-3 text-gray-600'>جاري التحميل...</span>
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
              <h3 className='text-lg font-semibold text-red-900 mb-2'>
                خطأ في تحميل البيانات
              </h3>
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className='space-y-6'>
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-green-900 mb-2'>
                  البيانات المحملة بنجاح
                </h3>
                <div className='text-sm text-green-700'>
                  <p>
                    <strong>Operation:</strong>{' '}
                    {data.operationId || config.operationId}
                  </p>
                  <p>
                    <strong>Success:</strong>{' '}
                    {data.success
                      ? t('shared.hub.UniversalHubScreen.yes')
                      : t('shared.hub.UniversalHubScreen.no')}
                  </p>
                  {data.timestamp && (
                    <p>
                      <strong>Timestamp:</strong>{' '}
                      {new Date(data.timestamp).toLocaleString('ar-SA')}
                    </p>
                  )}
                </div>
              </div>

              {data.data && (
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                    البيانات
                  </h3>
                  <pre className='text-xs bg-white p-4 rounded border overflow-auto max-h-96'>
                    {JSON.stringify(data.data, null, 2)}
                  </pre>
                </div>
              )}

              {!data.data && (
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <p className='text-sm text-yellow-700'>
                    لا توجد بيانات متاحة حالياً
                  </p>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !data && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
              <p className='text-sm text-yellow-700'>لا توجد بيانات متاحة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
