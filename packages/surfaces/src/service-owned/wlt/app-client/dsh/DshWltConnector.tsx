import React from 'react';
import { Button } from '@bthwani/ui-kit';
import useWlt from './hooks/useWlt';

export default function DshWltConnector({ onLinked }: { onLinked?: () => void }) {
  const { linked, link } = useWlt();

  return (
    <Button
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
