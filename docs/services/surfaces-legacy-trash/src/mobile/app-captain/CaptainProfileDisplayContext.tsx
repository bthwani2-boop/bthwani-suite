/**
 * CaptainProfileDisplayContext — اسم الكابتن، التقييم، والمستوى للعرض في الشريط وشاشة الحساب
 * يُملأ من واجهة الملف الشخصي (platform) ويُعرض في TopBar + CaptainProfileScreen
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export type CaptainProfileDisplay = {
  displayName: string | null;
  rating: number | null;
  tierLabel: string | null;
};

type CaptainProfileDisplayContextValue = CaptainProfileDisplay & {
  setDisplayProfile: (name: string | null, rating: number | null, tierLabel?: string | null) => void;
};

const CaptainProfileDisplayContext = createContext<CaptainProfileDisplayContextValue | null>(null);

export function CaptainProfileDisplayProvider({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [tierLabel, setTierLabel] = useState<string | null>(null);

  const setDisplayProfile = useCallback(
    (name: string | null, r: number | null, tier?: string | null) => {
      setDisplayName(name);
      setRating(r);
      if (tier !== undefined) setTierLabel(tier);
    },
    []
  );

  const value: CaptainProfileDisplayContextValue = {
    displayName,
    rating,
    tierLabel,
    setDisplayProfile,
  };

  return (
    <CaptainProfileDisplayContext.Provider value={value}>
      {children}
    </CaptainProfileDisplayContext.Provider>
  );
}

export function useCaptainProfileDisplay(): CaptainProfileDisplayContextValue {
  const ctx = useContext(CaptainProfileDisplayContext);
  if (!ctx) throw new Error('useCaptainProfileDisplay must be used within CaptainProfileDisplayProvider');
  return ctx;
}
