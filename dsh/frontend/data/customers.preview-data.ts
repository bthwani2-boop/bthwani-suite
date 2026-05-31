import { DSH_CUSTOMER_360_PREVIEW } from './support.preview-data';

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
  latestTicketId: customer.ticketsHistory?.[0]?.ticketId,
}));

export function getDshPreviewCustomer(customerId: string) {
  return dshPreviewCustomers.find((customer) => customer.id === customerId) ?? null;
}
