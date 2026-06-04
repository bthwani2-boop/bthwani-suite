// Typed client for DSH product identity API.
// Covers: POST /stores/{store_id}/products, PATCH /products/{id},
//         GET /stores/{store_id}/products, GET /products/{id}
// No UI. No React. Pure types + factory.
// Authority: app-partner submits product identity; control-panel owns approval.
// WLT boundary: price is a label only — no financial mutation inside DSH.

export type DshProductApprovalStatus =
  | 'field_draft'
  | 'partner_submitted'
  | 'partner_review'
  | 'partner_approved'
  | 'marketing_review'
  | 'marketing_approved'
  | 'catalog_adopted'
  | 'client_visible'
  | 'needs_fix'
  | 'rejected';

export type DshProductRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly name: string;
  readonly sku?: string;
  readonly gtin?: string;
  readonly barcode?: string;
  readonly description?: string;
  readonly base_price_label: string;
  readonly category_id?: string;
  readonly approval_status: DshProductApprovalStatus;
  readonly created_at: string;
  readonly updated_at: string;
};

export type DshCreateProductRequest = {
  readonly name: string;
  readonly sku?: string;
  readonly gtin?: string;
  readonly barcode?: string;
  readonly description?: string;
  readonly base_price_label: string;
  readonly category_id?: string;
};

export type DshUpdateProductRequest = {
  readonly name?: string;
  readonly sku?: string;
  readonly gtin?: string;
  readonly barcode?: string;
  readonly description?: string;
  readonly base_price_label?: string;
  readonly category_id?: string;
};

export type DshListProductsResponse = {
  readonly products: readonly DshProductRecord[];
  readonly pagination: {
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
  };
};

// ─── Transport contract ────────────────────────────────────────────────────────

export type DshProductApiTransport = {
  post(path: string, body: unknown): Promise<DshProductRecord>;
  patch(path: string, body: unknown): Promise<DshProductRecord>;
  get(path: string): Promise<unknown>;
};

// ─── Client contract ──────────────────────────────────────────────────────────

export type DshProductApiClient = {
  createProduct(
    storeId: string,
    req: DshCreateProductRequest,
  ): Promise<DshProductRecord>;

  updateProduct(
    productId: string,
    req: DshUpdateProductRequest,
  ): Promise<DshProductRecord>;

  getProduct(productId: string): Promise<DshProductRecord>;

  listProducts(
    storeId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<DshListProductsResponse>;
};

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createDshProductApiClient(
  transport: DshProductApiTransport,
): DshProductApiClient {
  return {
    createProduct: (storeId, req) =>
      transport.post(`/stores/${storeId}/products`, req),

    updateProduct: (productId, req) =>
      transport.patch(`/products/${productId}`, req),

    getProduct: (productId) =>
      transport.get(`/products/${productId}`) as Promise<DshProductRecord>,

    listProducts: (storeId, options = {}) => {
      const params = new URLSearchParams();
      if (options.limit !== undefined) params.set('limit', String(options.limit));
      if (options.offset !== undefined) params.set('offset', String(options.offset));
      const qs = params.toString();
      const path = qs ? `/stores/${storeId}/products?${qs}` : `/stores/${storeId}/products`;
      return transport.get(path) as Promise<DshListProductsResponse>;
    },
  };
}
