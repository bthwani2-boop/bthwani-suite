import React from 'react';
import { BthButton } from '@bthwani/ui-kit';
import useWlt from './hooks/useWlt';

export default function DshWltConnector({ onLinked }: { onLinked?: () => void }) {
  const { linked, link } = useWlt();

  return (
    <BthButton
      label={linked ? 'محفظة متصلة' : 'ربط المحفظة'}
      tone={linked ? 'secondary' : 'primary'}
      onPress={async () => {
        if (!linked) {
          await link();
          onLinked?.();
        }
      }}
    />
  );
}
