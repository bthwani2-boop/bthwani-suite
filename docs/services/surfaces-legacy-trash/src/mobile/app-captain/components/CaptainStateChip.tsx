/**
 * CaptainStateChip — Status + GPS Chips for Top Bar
 * §UX-SUPREME-001: Zero distraction, clear status indication
 *
 * Features:
 * - Status Chip (متاح / في مهمة / متوقف)
 * - GPS Chip (GPS ON / Offline)
 * - Small, unobtrusive design
 * - Uses semantic tokens only
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';

export type CaptainStatus = 'available' | 'on_trip' | 'offline' | 'stopped';
export type GPSStatus = 'on' | 'off' | 'searching';

interface CaptainStateChipProps {
  status: CaptainStatus;
  gpsStatus: GPSStatus;
  showGPS?: boolean;
  /** عند false يُخفى رقاقة التوفر (متاح/متوقف) — لاستخدامها مع شريط التوفر فقط وتجنب التكرار */
  showStatus?: boolean;
}

const GPS_LABELS: Record<GPSStatus, string> = {
  on: 'GPS',
  off: 'GPS OFF',
  searching: 'GPS...',
};

const getStatusColor = (status: CaptainStatus) => {
  switch (status) {
    case 'available':
      return semanticRoles.stateSuccess;
    case 'on_trip':
      return semanticRoles.stateInfo;
    case 'offline':
    case 'stopped':
      return semanticRoles.stateError;
    default:
      return semanticRoles.stateInfo;
  }
};

const getGPSColor = (gpsStatus: GPSStatus) => {
  switch (gpsStatus) {
    case 'on':
      return semanticRoles.stateSuccess;
    case 'searching':
      return semanticRoles.stateWarning;
    case 'off':
      return semanticRoles.stateError;
    default:
      return semanticRoles.stateError;
  }
};

export const CaptainStateChip: React.FC<CaptainStateChipProps> = ({
  status,
  gpsStatus,
  showGPS = true,
  showStatus = true,
}) => {
  const { rowStyle, t } = useDirection();
  const statusColor = getStatusColor(status);
  const gpsColor = getGPSColor(gpsStatus);
  const statusLabels: Record<CaptainStatus, string> = {
    available: t('surfaces.متاح'),
    on_trip: t('surfaces.في_مهمة'),
    offline: t('surfaces.غير_متصل'),
    stopped: t('surfaces.متوقف'),
  };

  return (
    <View style={[styles.container, rowStyle]}>
      {/* Status Chip — يُخفى عند استخدام شريط التوفر (AMN) لتجنب التكرار */}
      {showStatus && (
        <View
          style={[
            styles.chip,
            { backgroundColor: statusColor.background },
            rowStyle,
          ]}
        >
          <View style={[styles.dot, { backgroundColor: statusColor.icon }]} />
          <Text style={[styles.chipText, { color: statusColor.text }]}>
            {statusLabels[status]}
          </Text>
        </View>
      )}

      {/* GPS Chip */}
      {showGPS && (
        <View
          style={[
            styles.chip,
            {
              backgroundColor: gpsColor.background,
              marginStart: showStatus ? BTHWANI_SPACING.xs : 0,
            },
            rowStyle,
          ]}
        >
          <ServiceIcon
            name={gpsStatus === 'on' ? 'location-on' : 'location-off'}
            size={12}
            color={gpsColor.icon}
          />
          <Text
            style={[
              styles.chipText,
              { color: gpsColor.text, marginStart: BTHWANI_SPACING.xs / 2 },
            ]}
          >
            {GPS_LABELS[gpsStatus]}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs / 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: BTHWANI_SPACING.xs / 2,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
