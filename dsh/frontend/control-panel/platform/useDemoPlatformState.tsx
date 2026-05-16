import { useState } from 'react';

export type AuditEvent = {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
  status: 'success' | 'warning' | 'danger';
  oldValue: string;
  newValue: string;
  reason: string;
  scope: string;
  impact: string;
  rollbackAvailable: boolean;
};

export function useDemoPlatformStateHook() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      id: '1',
      action: 'تعديل حد أهلية الكابتن',
      operator: 'Admin-Ahmed',
      timestamp: 'قبل ساعتين',
      status: 'success',
      oldValue: '4.5',
      newValue: '4.2',
      reason: 'زيادة عدد الكباتن المتاحين في أوقات الذروة بناءً على توجيهات الإدارة التشغيلية.',
      scope: 'محافظة صنعاء',
      impact: 'زيادة +15% في القبول',
      rollbackAvailable: true,
    },
    {
      id: '2',
      action: 'تحديث مزود الدفع (Payment Provider)',
      operator: 'System-Bot (Auto Failover)',
      timestamp: 'قبل 3 أيام',
      status: 'warning',
      oldValue: 'Telr (الأساسي)',
      newValue: 'Paymob (البديل)',
      reason: 'استجابة لـ Downtime موثق في المزود الأساسي لمدة تجاوزت 5 دقائق.',
      scope: 'Global',
      impact: 'تجنب فشل 30% من عمليات الدفع المتوقعة',
      rollbackAvailable: true,
    }
  ]);

  const addAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: 'الآن (Demo)',
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const rollbackEvent = (id: string) => {
    setAuditEvents((prev) =>
      prev.map(evt =>
        evt.id === id
          ? { ...evt, rollbackAvailable: false, action: `[تم التراجع] ${evt.action}` }
          : evt
      )
    );
    // Also push a new audit for the rollback itself
    const original = auditEvents.find(e => e.id === id);
    if (original) {
      addAuditEvent({
        action: `تراجع عن: ${original.action}`,
        operator: 'Demo Admin',
        status: 'warning',
        oldValue: original.newValue,
        newValue: original.oldValue,
        reason: 'طلب تراجع تجريبي محلي (Rollback Simulation)',
        scope: original.scope,
        impact: 'عودة للحالة السابقة',
        rollbackAvailable: false,
      });
    }
  };

  return {
    auditEvents,
    addAuditEvent,
    rollbackEvent,
  };
}

import { createContext, useContext } from 'react';

type DemoState = ReturnType<typeof useDemoPlatformStateHook>;
const DemoContext = createContext<DemoState | null>(null);

export function DemoPlatformProvider({ children }: { children: React.ReactNode }) {
  const state = useDemoPlatformStateHook();
  return <DemoContext.Provider value={state}>{children}</DemoContext.Provider>;
}

export function useDemoPlatformState() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('Missing DemoPlatformProvider');
  return ctx;
}
