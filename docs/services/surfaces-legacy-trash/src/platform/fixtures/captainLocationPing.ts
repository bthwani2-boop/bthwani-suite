/**
 * Fixture for platform captain location ping (auto_platform_captain_location_ping).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  service_mode: 'DSH' | 'AMN';
}

export function buildPlatformCaptainLocationPingMock(serviceMode: 'DSH' | 'AMN'): LocationData {
  return {
    latitude: 24.7136,
    longitude: 46.6753,
    accuracy: 10,
    timestamp: new Date().toISOString(),
    service_mode: serviceMode,
  };
}
