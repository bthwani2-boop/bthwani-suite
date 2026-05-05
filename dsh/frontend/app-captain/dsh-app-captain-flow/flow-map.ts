export type DshCaptainFlowKey = 'entry' | 'orders' | 'finance' | 'profile' | 'operations';

export type DshCaptainFlowNode = {
  id: DshCaptainFlowKey;
  label: string;
  next: readonly DshCaptainFlowKey[];
};

export const dshCaptainFlowMap: Record<DshCaptainFlowKey, DshCaptainFlowNode> = {
  entry: {
    id: 'entry',
    label: 'مدخل الكابتن',
    next: ['orders', 'operations'],
  },
  orders: {
    id: 'orders',
    label: 'الطلبات',
    next: ['finance', 'profile', 'operations'],
  },
  finance: {
    id: 'finance',
    label: 'المالية',
    next: ['profile', 'operations'],
  },
  profile: {
    id: 'profile',
    label: 'الملف',
    next: ['operations'],
  },
  operations: {
    id: 'operations',
    label: 'التشغيل',
    next: ['orders'],
  },
} as const;
