/**
 * CaptainMapScreen — Map View for Captain
 * §UX-SUPREME-001: Clear navigation, real-time location
 *
 * Features:
 * - Mock map (simulated grid + location pin) until react-native-maps is integrated
 * - Current location marker
 * - Trip route (if active) — when using real MapView
 * - Nearby orders/offers (if available)
 *
 * Replace MockMapView with MapView from react-native-maps when ready.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

const GRID_STEP = 40;
const MAP_BG = BTHWANI_COLORS.successSubtle;
const GRID_COLOR = 'BTHWANI_COLORS.successTint';

function MockMapView() {
  const { t } = useI18n();
  const { width, height } = Dimensions.get('window');
  const cols = Math.min(Math.ceil(width / GRID_STEP) + 1, 15);
  const rows = Math.min(Math.ceil(height / GRID_STEP) + 1, 20);
  return (
    <View style={[styles.mockMap, { minHeight: height }]}>
      <Text style={styles.mockMapLabel}>{t('captain.map.mock_map_label')}</Text>
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.gridLine,
            {
              top: i * GRID_STEP,
              start: 0,
              width,
              height: 1,
            },
          ]}
        />
      ))}
      {Array.from({ length: cols }, (_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.gridLine,
            {
              start: i * GRID_STEP,
              top: 0,
              width: 1,
              height,
            },
          ]}
        />
      ))}
      <View style={styles.youAreHerePin}>
        <View style={styles.youAreHereDot} />
        <Text style={styles.youAreHereText}>{t('captain.map.your_location')}</Text>
      </View>
    </View>
  );
}

interface CaptainMapScreenProps {
  navigation?: any;
}

export const CaptainMapScreen: React.FC<CaptainMapScreenProps> = ({ navigation }) => {
  const { t } = useI18n();
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.mapContainer}>
        <MockMapView />
      </View>
      {navigation?.navigate && (
        <TouchableOpacity
          style={styles.typeSelectButton}
          onPress={() => navigation.navigate('CaptainTypeSelect')}
          activeOpacity={0.8}
        >
          <Text style={styles.typeSelectButtonText}>{t('captain.map.select_captain_type')}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAP_BG,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: MAP_BG,
  },
  mockMap: {
    flex: 1,
    backgroundColor: MAP_BG,
    overflow: 'hidden',
  },
  mockMapLabel: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    end: BTHWANI_SPACING.sm,
    fontSize: 12,
    color: semanticRoles.textMuted,
    zIndex: 1,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: GRID_COLOR,
  },
  youAreHerePin: {
    position: 'absolute',
    start: '50%',
    top: '50%',
    marginStart: -40,
    marginTop: -36,
    width: 80,
    height: 72,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  youAreHereDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: semanticRoles.primaryCTA,
    borderWidth: 3,
    borderColor: BTHWANI_COLORS.surface,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  youAreHereText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  typeSelectButton: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.lg,
    start: BTHWANI_SPACING.lg,
    end: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText ?? BTHWANI_COLORS.surface,
  },
});

export default CaptainMapScreen;
