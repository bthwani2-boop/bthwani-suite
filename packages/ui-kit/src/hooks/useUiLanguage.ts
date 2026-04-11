import React from 'react';
import { useDirection } from './useDirection';

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