/** Optional stub for expo-location when not installed (e.g. in surfaces build). */
declare module 'expo-location' {
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(options?: { accuracy?: number }): Promise<{
    coords: { latitude: number; longitude: number };
  }>;
  export const Accuracy: { Balanced: number };
}
