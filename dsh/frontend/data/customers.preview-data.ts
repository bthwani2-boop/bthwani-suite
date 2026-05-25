import { DSH_CUSTOMER_360_PREVIEW, DSH_DEMO_SUPPORT_TICKETS } from './support.preview-data';

export const dshCustomersPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export type DshPreviewCustomer = {
  id: string;
  name: string;
  latestTicketId?: string;
};

export const dshPreviewCustomers: readonly DshPreviewCustomer[] = DSH_CUSTOMER_360_PREVIEW.map((customer) => ({
  id: customer.customerId,
  name: customer.customerName,
  latestTicketId: customer.ticketHistory[0]?.ticketId ?? DSH_DEMO_SUPPORT_TICKETS.find((ticket) => ticket.customerId === customer.customerId)?.ticketId,
}));

export function getDshPreviewCustomer(customerId: string) {
  return dshPreviewCustomers.find((customer) => customer.id === customerId) ?? null;
}
