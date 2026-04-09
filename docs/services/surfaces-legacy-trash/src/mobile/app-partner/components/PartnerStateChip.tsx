/**
 * PartnerStateChip — Status + GPS Chips for Top Bar
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

export type PartnerStatus = 'available' | 'on_task' | 'offline' | 'stopped';
export type GPSStatus = 'on' | 'off' | 'searching';

interface PartnerStateChipProps {
  status: PartnerStatus;
  gpsStatus: GPSStatus;
  showGPS?: boolean;
}

const STATUS_LABELS: Record<PartnerStatus, string> = {
  available: 'متاح',
  on_task: 'في مهمة',
  offline: 'غير متصل',
  stopped: 'متوقف',
};

const GPS_LABELS: Record<GPSStatus, string> = {
  on: 'GPS',
  off: 'GPS OFF',
  searching: 'GPS...',
};

const getStatusColor = (status: PartnerStatus) => {
  switch (status) {
    case 'available':
      return semanticRoles.stateSuccess;
    case 'on_task':
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

export const PartnerStateChip: React.FC<PartnerStateChipProps> = ({
  status,
  gpsStatus,
  showGPS = true,
}) => {
  const { rowStyle } = useDirection();
  const statusColor = getStatusColor(status);
  const gpsColor = getGPSColor(gpsStatus);

  return (
    <View style={[styles.container, rowStyle]}>
      {/* Status Chip */}
      <View
        style={[
          styles.chip,
          { backgroundColor: statusColor.background },
          rowStyle,
        ]}
      >
        <View style={[styles.dot, { backgroundColor: statusColor.icon }]} />
        <Text style={[styles.chipText, { color: statusColor.text }]}>
          {STATUS_LABELS[status]}
        </Text>
      </View>

      {/* GPS Chip */}
      {showGPS && (
        <View
          style={[
            styles.chip,
            {
              backgroundColor: gpsColor.background,
              marginStart: BTHWANI_SPACING.xs,
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
