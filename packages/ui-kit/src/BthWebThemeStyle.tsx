import { buildBthWebThemeStyleSheet } from './foundation';

const webThemeStyleSheet = buildBthWebThemeStyleSheet();

export function BthWebThemeStyle() {
  return <style>{webThemeStyleSheet}</style>;
}