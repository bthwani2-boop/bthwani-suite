import React from 'react';
import { getBthUiText } from './foundation';
import { useDirectionContext } from './DirectionProvider';
import { useThemeContext } from './ThemeProvider';

function getValueByDot(obj: any, key: string) {
  if (!key) return undefined;
  const parts = key.split('.');
  let current = obj as any;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

export function useDirection() {
  return useDirectionContext();
}

export function useTheme() {
  return useThemeContext();
}

export function useUiLanguage() {
  const { language, setLanguage } = useDirection();
  const isEnglish = language === 'en';

  const toggleLanguage = React.useCallback(() => {
    setLanguage(isEnglish ? 'ar' : 'en');
  }, [isEnglish, setLanguage]);

  return {
    language,
    isEnglish,
    toggleLanguage,
  };
}

export function useUiText() {
  const { language } = useDirection();
  return getBthUiText(language === 'en' ? 'en' : 'ar');
}

export function useI18n() {
  const uiText = useUiText();
  const { direction, language } = useDirection();

  const t = (key: string, vars?: Record<string, any>) => {
    const value = getValueByDot(uiText, key);

    if (typeof value === 'string') {
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (_, name) => {
        const resolved = vars[name];
        if (resolved === undefined || resolved === null) return '';
        return String(resolved);
      });
    }

    return String(value ?? key);
  };

  const isRTL = direction === 'rtl';

  return { t, isRTL, language, direction, uiText };
}

export default useI18n;