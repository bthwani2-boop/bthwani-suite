import React from 'react';
import * as ScreenModule from '../../dsh/app-field/entry/screens/DshEntryScreen';

const ResolvedScreen =
  (ScreenModule as any).default ??
  (ScreenModule as any).DshEntryScreen;

if (!ResolvedScreen) {
  throw new Error('No usable export found in ../../dsh/app-field/entry/screens/DshEntryScreen');
}

export default ResolvedScreen;
export * from '../../dsh/app-field/entry/screens/DshEntryScreen';
