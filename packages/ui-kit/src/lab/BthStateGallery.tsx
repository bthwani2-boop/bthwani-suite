import React from 'react';
import { bthStateIds } from '../states';
import { BthMobileScrollView } from '../adapters';
import { BthStateView } from '../components';
import { BthBox, BthText } from '../primitives';

export type BthStateGalleryProps = {
  language?: string;
};

const noop = () => undefined;

export function BthStateGallery({ language }: BthStateGalleryProps) {
  return (
    <BthMobileScrollView fill padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">State Gallery</BthText>
        <BthText role="bodyMd" tone="muted">
          Shared loading, empty, recovery, and fallback states rendered from the central catalog.
        </BthText>
      </BthBox>
      {bthStateIds.map((stateId) => (
        <BthStateView
          key={stateId}
          stateId={stateId}
          language={language}
          onActionPress={noop}
        />
      ))}
    </BthMobileScrollView>
  );
}