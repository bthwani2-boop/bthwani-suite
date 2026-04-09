import { buildBthWebThemeStyleSheet } from '../../foundation/themes';

const webThemeStyleSheet = buildBthWebThemeStyleSheet();

export function BthWebThemeStyle() {
  return <style>{webThemeStyleSheet}</style>;
}