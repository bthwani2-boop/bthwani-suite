export async function loadAsync(): Promise<void> {
  return undefined;
}

export function isLoaded(): boolean {
  return true;
}

export function isLoading(): boolean {
  return false;
}

export function processFontFamily(fontFamily?: string): string | undefined {
  return fontFamily;
}

export const Font = {
  loadAsync,
  isLoaded,
  isLoading,
  processFontFamily,
};

export default Font;
