import React from 'react';
import { useDirection } from '../../hooks';
import { BthTextField, type BthTextFieldProps } from './BthTextField';

export function BthSearchField({ placeholder, ...props }: BthTextFieldProps) {
  const { language } = useDirection();
  const fallbackPlaceholder = String(language).toLowerCase().startsWith('en') ? 'Search' : 'ابحث';

  return <BthTextField placeholder={placeholder ?? fallbackPlaceholder} {...props} />;
}
