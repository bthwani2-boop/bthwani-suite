import { getBthUiText } from '../foundation/i18n';
import { useDirection } from './useDirection';

export function useUiText() {
  const { language } = useDirection();
  return getBthUiText(language === 'en' ? 'en' : 'ar');
}
