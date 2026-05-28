import React from 'react';
import { Surface, Text, Button } from '@bthwani/ui-kit';

export function FilterToken({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <Surface tone="raised" paddingX={2} paddingY={1} radiusToken="pill" layoutDirection="row" align="center" gap={1}>
      <Text role="caption" style={{ fontWeight: 700 }}>{label}</Text>
      <Button label="✕" accessibilityLabel="إزالة" tone="secondary" size="sm" onPress={onRemove} style={{ minWidth: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 }} />
    </Surface>
  );
}
