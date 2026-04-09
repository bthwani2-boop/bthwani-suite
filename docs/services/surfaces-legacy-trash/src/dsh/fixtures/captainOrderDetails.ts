/**
 * Fixture for DSH captain order details (auto_dsh_captain_order_details).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 * mapApiResponseToOrderDetails: map API response to OrderDetails; buildDshCaptainOrderDetailsFallback: fallback when API fails.
 */

export interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  estimatedDeliveryTime: string;
  distanceKm?: number;
  customer_id?: string | null;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
  /** Awnak: ملاحظات العميل */
  notes?: string | null;
  /** Awnak: نوع الطلب */
  orderType?: string | null;
  source?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-captain.mobile.auto_dsh_captain_order_details';

/** Map API response (from getDshCaptainOrder) to OrderDetails. */
export function mapApiResponseToOrderDetails(
  d: Record<string, unknown>,
  t: TFunction,
  orderId: string
): OrderDetails {
  return {
    id: (d.id as string) ?? orderId,
    customerName: (d.customer_name as string) ?? (d.restaurant as string) ?? t(`${NS}.l81`),
    customerPhone: (d.customer_phone as string) ?? '',
    restaurantName: (d.restaurant as string) ?? '',
    restaurantAddress: (d.pickup_location as string) ?? '',
    deliveryAddress: (d.delivery_location as string) ?? '',
    items: Array.isArray(d.items) ? (d.items as OrderDetails['items']) : [],
    totalAmount: Number(d.total) ?? 0,
    status: (d.status as string) ?? 'pending',
    createdAt: (d.orderTime as string) ?? new Date().toISOString(),
    estimatedDeliveryTime: (d.deliveryTime as string) ?? t(`${NS}.l90`),
    distanceKm: typeof d.distance_km === 'number' ? d.distance_km : undefined,
    customer_id: d.customer_id != null ? (d.customer_id as string) : null,
    delivery_lat: typeof d.delivery_lat === 'number' ? d.delivery_lat : null,
    delivery_lng: typeof d.delivery_lng === 'number' ? d.delivery_lng : null,
    notes: typeof d.notes === 'string' ? d.notes : null,
    orderType: typeof d.order_type === 'string' ? d.order_type : null,
    source: typeof d.source === 'string' ? d.source : undefined,
  };
}

/** Fallback order details when API fails (dev/demo). */
export function buildDshCaptainOrderDetailsFallback(t: TFunction, orderId: string): OrderDetails {
  return {
    id: orderId,
    customerName: t(`${NS}.l81`),
    customerPhone: '+966501234567',
    restaurantName: t(`${NS}.l81`),
    restaurantAddress: '',
    deliveryAddress: '',
    items: [],
    totalAmount: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: t(`${NS}.l90`),
  };
}
