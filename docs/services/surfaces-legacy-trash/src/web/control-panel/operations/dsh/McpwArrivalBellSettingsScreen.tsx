import React from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  PreferenceScreenLayout,
  PreferenceSection,
  PreferenceCard,
  PreferenceRow,
} from '../../components/preferences/PreferencePrimitives.web';

const VAR_DEFAULTS: { key: string; value: string; labelAr: string }[] = [
  {
    key: 'VAR_ARRIVAL_BELL_ENABLED',
    value: 'true',
    labelAr: 'تفعيل جرس الوصول',
  },
  {
    key: 'VAR_ARRIVAL_BELL_MAX_DISTANCE_METERS',
    value: '35',
    labelAr: 'أقصى مسافة للوصول (م)',
  },
  {
    key: 'VAR_ARRIVAL_BELL_COOLDOWN_SECONDS',
    value: '30',
    labelAr: 'تبريد بين الرنات (ث)',
  },
  {
    key: 'VAR_ARRIVAL_BELL_MAX_RINGS_PER_ORDER',
    value: '3',
    labelAr: 'أقصى رنات لكل طلب',
  },
  {
    key: 'VAR_ARRIVAL_BELL_REQUIRE_ARRIVED_STATUS',
    value: 'true',
    labelAr: 'إلزام تسجيل وصلت قبل الرن',
  },
  {
    key: 'VAR_ARRIVAL_BELL_QUIET_HOURS_ENABLED',
    value: 'true',
    labelAr: 'تفعيل ساعات الهدوء',
  },
];

export default function McpwArrivalBellSettingsScreen() {
  const { t } = useI18n();

  return (
    <PreferenceScreenLayout
      title={t('web.control panel.operations.dsh.arrivals.settingsTitle')}
      subtitle={t('web.control panel.operations.dsh.arrivals.settingsSubtitle')}
    >
      <PreferenceSection
        title={t('web.control panel.operations.dsh.arrivals.runtimeVariablesTitle')}
        description={t(
          'web.control panel.operations.dsh.arrivals.runtimeVariablesDescription'
        )}
      >
        <PreferenceCard>
          <div className='space-y-2'>
            {VAR_DEFAULTS.map(row => (
              <PreferenceRow
                key={row.key}
                title={row.key}
                subtitle={row.labelAr}
                trailingSlot={
                  <span className='text-sm font-semibold'>{row.value}</span>
                }
              />
            ))}
          </div>
        </PreferenceCard>
      </PreferenceSection>

      <PreferenceSection
        title={t('web.control panel.operations.dsh.arrivals.quietHoursTitle')}
        description={t(
          'web.control panel.operations.dsh.arrivals.quietHoursDescription'
        )}
      >
        <PreferenceCard>
          <PreferenceRow
            title={t('web.control panel.operations.dsh.arrivals.quietHoursStart')}
            subtitle='23:00'
            trailingSlot={<span className='text-sm text-gray-600'>GMT+3</span>}
          />
        </PreferenceCard>
      </PreferenceSection>

      <PreferenceSection
        title={t('web.control panel.operations.dsh.arrivals.timelineTitle')}
        description={t('web.control panel.operations.dsh.arrivals.timelineDescription')}
      >
        <PreferenceCard>
          <div className='text-sm text-gray-600 space-y-2'>
            <p>
              {t('web.control panel.operations.dsh.arrivals.timelineApiNote')}
              <code className='bg-gray-100 px-2 py-1 rounded mx-1'>
                GET /api/dsh/orders/:orderId/arrival/status
              </code>
            </p>
          </div>
        </PreferenceCard>
      </PreferenceSection>
    </PreferenceScreenLayout>
  );
}

