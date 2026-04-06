import React from 'react';
import { BthTextField, type BthTextFieldProps } from './BthTextField';

export function BthSearchField(props: BthTextFieldProps) {
  return <BthTextField placeholder="بحث" {...props} />;
}
