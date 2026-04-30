/**
 * KNZ API stub — §86 compliant placeholder until @bthwani/api-clients has generated KNZ client.
 * All API calls from UI MUST go through packages/api-clients; this stub is temporary and MUST be
 * replaced by re-export from @bthwani/api-clients when KNZ client is generated from Master OpenAPI.
 *
 * KNZ captain_* methods: OUT OF SCOPE per policy (KNZ_POLICY_EXECUTION_ROADMAP). Captain types = DSH and AMN only.
 * The folder packages/surfaces/src/knz/app-captain has been removed; these stubs remain for API contract reference only and are not used by any surface.
 */

const stub = async <T>(data: T, ms = 300): Promise<T> => {
  await new Promise((r) => setTimeout(r, ms));
  return data;
};

export const knzApi = {
  knz_captain_shift_start: (body: Record<string, unknown>) =>
    stub({ shift_start_time: new Date().toISOString(), ...body }),
  knz_captain_shift_get: () =>
    stub({ shift_id: 'stub', status: 'active', start_time: new Date().toISOString() }),
  knz_captain_shift_end: (body: Record<string, unknown>) =>
    stub({ shift_id: (body as { shift_id?: string }).shift_id ?? 'stub', end_time: new Date().toISOString() }),
  knz_captain_listing_get: (params: { listing_id: string }) =>
    stub({ listing_id: params.listing_id, title: 'Stub listing', status: 'active' }),
  knz_captain_listing_inspect: (body: Record<string, unknown>) => stub({ ok: true, ...body }),
  knz_captain_matches_list: () => stub({ matches: [], total: 0 }),
  knz_captain_match_confirm: (params: { match_id: string }) => stub({ match_id: params.match_id, confirmed: true }),
  knz_captain_match_get: (params: { match_id: string }) =>
    stub({ match_id: params.match_id, status: 'pending', listing_id: '', buyer_id: '', seller_id: '' }),
  knz_captain_deliveries_list: () => stub({ deliveries: [], total: 0 }),
  knz_captain_delivery_pickup_from_seller: (params: Record<string, unknown>) =>
    stub({ delivery_id: (params as { delivery_id?: string }).delivery_id ?? 'stub', status: 'picked_up' }),
  knz_captain_delivery_pickup_confirmed: (params: { delivery_id: string }) =>
    stub({ delivery_id: params.delivery_id, status: 'pickup_confirmed' }),
  knz_captain_delivery_to_buyer: (params: Record<string, unknown>) =>
    stub({ delivery_id: (params as { delivery_id?: string }).delivery_id ?? 'stub', status: 'in_transit' }),
  knz_captain_delivery_complete: (params: Record<string, unknown>) =>
    stub({ delivery_id: (params as { delivery_id?: string }).delivery_id ?? 'stub', status: 'completed' }),
  knz_captain_delivery_tracking: (params: { delivery_id: string }) =>
    stub({ delivery_id: params.delivery_id, status: 'in_transit', location: null }),
  knz_captain_disputes_list: () => stub({ disputes: [], total: 0 }),
  knz_captain_dispute_resolve: (params: Record<string, unknown>) =>
    stub({ dispute_id: (params as { dispute_id?: string }).dispute_id ?? 'stub', resolved: true }),
  knz_captain_dispute_get: (params: { dispute_id: string }) =>
    stub({ dispute_id: params.dispute_id, status: 'open', description: '' }),
  knz_captain_profile_get: () =>
    stub({ captain_id: 'stub', display_name: 'Captain', status: 'active' }),
  knz_captain_earnings_get: () => stub({ total_earnings: 0, pending: 0, period: 'today' }),
  knz_captain_location_ping: (body: Record<string, unknown>) => stub({ ok: true, ...body }),
};
