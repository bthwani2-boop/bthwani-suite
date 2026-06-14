import { getSurfaceModeCapability } from '../../contracts/dsh-fulfillment-surface-visibility';
import type { DshOrderLifecycleHandoff } from '../../contracts/dsh-order-lifecycle-handoffs';

type PartnerOrderForOps = {
  status: string;
  priority?: string;
  slaRisk?: boolean;
  issueRequired?: boolean;
};

export type PartnerDeliveryOpsSummary = {
  outForDelivery: number;
  handoffReady: number;
  deliveredToday: number;
  delayedRisk: number;
};

export function buildPartnerDeliveryOpsSummary(
  partnerOrders: readonly PartnerOrderForOps[],
  partnerActionableHandoffs: readonly DshOrderLifecycleHandoff[],
): PartnerDeliveryOpsSummary {
  const partnerReceivesOrders =
    getSurfaceModeCapability('bthwani_delivery').partner.receivesOrder ||
    getSurfaceModeCapability('partner_delivery').partner.receivesOrder;

  return {
    outForDelivery: partnerOrders.filter(
      (o) =>
        o.status === 'captain_assigned' ||
        o.status === 'captain_arriving' ||
        o.status === 'delivering',
    ).length,
    handoffReady: partnerReceivesOrders
      ? partnerOrders.filter(
          (o) =>
            o.status === 'ready' ||
            o.status === 'items_ready' ||
            o.status === 'handoff',
        ).length
      : 0,
    deliveredToday: partnerOrders.filter((o) => o.status === 'completed').length,
    delayedRisk:
      partnerOrders.filter((o) => o.priority === 'high' || o.slaRisk || o.issueRequired).length +
      partnerActionableHandoffs.filter((h) => h.wltImpact.eventKind !== 'none').length,
  };
}
