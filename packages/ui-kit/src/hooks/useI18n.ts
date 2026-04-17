import { useUiText } from './useUiText';
import { useDirection } from './useDirection';

function getValueByDot(obj: any, key: string) {
  if (!key) return undefined;
  const parts = key.split('.');
  let cur = obj as any;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function useI18n() {
  const uiText = useUiText();
  const { direction, language } = useDirection();

  const t = (key: string, vars?: Record<string, any>) => {
    const value = getValueByDot(uiText, key);
    if (typeof value === 'string') {
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (_, name) => {
        const v = vars[name];
        if (v === undefined || v === null) return '';
        return String(v);
      });
    }

    return String(value ?? key);
  };

  const isRTL = direction === 'rtl';

  return { t, isRTL, language, direction, uiText };
}

export default useI18n;
