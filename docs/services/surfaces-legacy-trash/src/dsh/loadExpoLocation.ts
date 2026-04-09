export interface ExpoLocationModule {
  requestForegroundPermissionsAsync: () => Promise<{ status: string }>;
  getCurrentPositionAsync: (options: { accuracy: number }) => Promise<{
    coords: {
      latitude: number;
      longitude: number;
    };
  }>;
  Accuracy: {
    Balanced: number;
  };
}

export async function loadExpoLocation(): Promise<ExpoLocationModule | null> {
  try {
    const moduleName = 'expo-location';
    return (await import(moduleName)) as ExpoLocationModule;
  } catch {
    return null;
  }
}
