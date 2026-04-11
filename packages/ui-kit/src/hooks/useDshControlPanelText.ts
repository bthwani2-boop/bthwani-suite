import { getDshControlPanelText } from '../foundation/i18n';
import { useDirection } from './useDirection';

export function useDshControlPanelText() {
  const { language } = useDirection();
  return getDshControlPanelText(language === 'en' ? 'en' : 'ar');
}