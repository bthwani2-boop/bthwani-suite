import { useState, createContext, useContext } from 'react';

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

export function usePlatformAuditStateHook() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  const addAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: 'الآن',
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
    const original = auditEvents.find(e => e.id === id);
    if (original) {
      addAuditEvent({
        action: `تراجع عن: ${original.action}`,
        operator: 'operator',
        status: 'warning',
        oldValue: original.newValue,
        newValue: original.oldValue,
        reason: 'طلب تراجع معتمد عن طريق لوحة التحكم',
        scope: original.scope,
        impact: 'عودة للحالة السابقة وتطبيق السياسة الأصلية',
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

type PlatformAuditState = ReturnType<typeof usePlatformAuditStateHook>;
const PlatformAuditContext = createContext<PlatformAuditState | null>(null);

export function PlatformAuditProvider({ children }: { children: React.ReactNode }) {
  const state = usePlatformAuditStateHook();
  return <PlatformAuditContext.Provider value={state}>{children}</PlatformAuditContext.Provider>;
}

export function usePlatformAuditState() {
  const ctx = useContext(PlatformAuditContext);
  if (!ctx) throw new Error('Missing PlatformAuditProvider');
  return ctx;
}
