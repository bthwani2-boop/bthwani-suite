// Dev/demo fixture for wlt_subscription_invoices_list. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  description: string;
}

export function buildInvoicesMock(): Invoice[] {
  return [
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      amount: 29.99,
      currency: 'SAR',
      status: 'paid',
      date: '2024-01-15',
      description: 'Monthly Subscription - Gold Plan',
    },
    {
      id: 'inv_002',
      number: 'INV-2024-002',
      amount: 29.99,
      currency: 'SAR',
      status: 'paid',
      date: '2024-02-15',
      description: 'Monthly Subscription - Gold Plan',
    },
    {
      id: 'inv_003',
      number: 'INV-2024-003',
      amount: 29.99,
      currency: 'SAR',
      status: 'pending',
      date: '2024-03-15',
      description: 'Monthly Subscription - Gold Plan',
    },
  ];
}
