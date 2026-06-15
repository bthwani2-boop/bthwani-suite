import {
  buildWltRuntimeFinancialCenter,
  type WltDshFinanceRuntimeResult,
} from '../boundary/wltDshFinanceRuntime.adapter';

export function resolveWltFinanceBusinessDate(now: Date = new Date()): string {
  return now.toISOString().split('T')[0]!;
}

export function buildWltDshFinanceHubViewModel(runtimeFinance: WltDshFinanceRuntimeResult | null) {
  const center = runtimeFinance?.state === 'runtime'
    ? buildWltRuntimeFinancialCenter(resolveWltFinanceBusinessDate(), runtimeFinance.data)
    : null;

  const pendingCount = center?.allEntries.filter((entry) => entry.isPending).length ?? 0;
  const openRisksCount = center?.allEntries.filter((entry) => entry.status === 'blocked' || entry.status === 'disputed').length ?? 0;

  const affectedParties = new Set<string>();
  center?.allEntries.forEach((entry) => {
    if (!entry.isPending && entry.status !== 'blocked' && entry.status !== 'disputed') return;
    if (entry.partyKind === 'client') affectedParties.add('العملاء');
    if (entry.partyKind === 'partner') affectedParties.add('الشركاء');
    if (entry.partyKind === 'captain') affectedParties.add('الكباتن');
    if (entry.partyKind === 'field') affectedParties.add('الميدانيين');
  });

  const affectedSurfaces = !center
    ? '—'
    : affectedParties.size === 0
      ? 'لا يوجد طرف متأثر حالياً'
      : Array.from(affectedParties).join(' · ');

  const requiredAction = !center
    ? '—'
    : center.blockingVariances.length > 0
      ? 'تحقيق ومطابقة الفوارق يدوياً'
      : center.allEntries.some((entry) => entry.status === 'pending')
        ? 'اعتماد وصرف المستحقات مع WLT'
        : 'مراقبة وتدقيق الأرصدة اليومية';

  const operationalRisk = !center
    ? '—'
    : center.blockingVariances.length > 0
      ? `يوجد فوارق معلقة (${center.blockingVariances.length} فارق نشط)`
      : center.allEntries.some((entry) => entry.status === 'blocked')
        ? 'مخاطر حرج عالية (High Risk)'
        : center.allEntries.some((entry) => entry.status === 'disputed' || entry.status === 'pending')
          ? 'تنبيه تدقيق متوسط (Medium Risk)'
          : 'لا توجد مخاطر مالية مكشوفة';

  const holdsStatus = !center
    ? '—'
    : center.blockingVariances.length > 0
      ? '🔒 معلق بالكامل (تسوية وصرف محجوبة)'
      : center.allEntries.some((entry) => entry.status === 'blocked' || entry.status === 'disputed')
        ? '⚠️ تعليق جزئي (حظر تسوية متأثرة)'
        : '✓ لا يوجد حظر (جاهز للتسوية)';

  return {
    center,
    pendingCount,
    openRisksCount,
    affectedSurfaces,
    requiredAction,
    operationalRisk,
    holdsStatus,
  };
}
