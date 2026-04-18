import React from 'react';
import { BthBox, BthButton, BthText } from '@bthwani/ui-kit';
import * as wallet from '../adapters/DshWalletAdapter';

export type DshWalletButtonProps = {
  onChange?: (linked: boolean) => void;
};

export default function DshWalletButton({ onChange }: DshWalletButtonProps) {
  const [linked, setLinked] = React.useState<boolean | null>(null);
  const [name, setName] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const l = await wallet.isWalletLinked();
      if (!mounted) return;
      setLinked(l);
      if (l) {
        const acc = await wallet.getWalletAccount();
        const bal = await wallet.getWalletBalance();
        if (!mounted) return;
        setName(acc?.name ?? null);
        setBalance(bal);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLink = async () => {
    setLoading(true);
    const res = await wallet.linkWallet();
    setLoading(false);
    if (res.success) {
      setLinked(true);
      setName(res.account?.name ?? null);
      const bal = await wallet.getWalletBalance();
      setBalance(bal);
      onChange?.(true);
    }
  };

  const handleUnlink = async () => {
    setLoading(true);
    await wallet.unlinkWallet();
    setLoading(false);
    setLinked(false);
    setName(null);
    setBalance(null);
    onChange?.(false);
  };

  return (
    <BthBox gap={1}>
      <BthText role="caption" tone="muted">
        {linked ? `${name} — ${(balance ?? 0) / 100} SAR` : 'ادفع بسرعة باستخدام محفظة بثواني'}
      </BthText>
      {linked ? (
        <BthButton label={`المحفظة متصلة — ${(balance ?? 0) / 100} SAR`} onPress={handleUnlink} tone="secondary" />
      ) : (
        <BthButton label={loading ? 'جارٍ الربط…' : 'ربط المحفظة'} onPress={handleLink} />
      )}
    </BthBox>
  );
}
