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

export type DshProductMediaRecord = {
  readonly id: string;
  readonly product_id: string;
  readonly media_key: string;
  readonly url: string;
  readonly created_at: string;
};

export type DshUploadProductMediaRequest = {
  readonly product_id: string;
  readonly media_key: string;
};

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
  readonly media?: readonly DshProductMediaRecord[];
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

// ─── J-002 / DSH-SLICE-002B: Category Structure ─────────────────────────────

export type DshCategoryRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly parent_id?: string;
  readonly name: string;
  readonly description?: string;
  readonly created_at: string;
  readonly updated_at: string;
};

export type DshCreateCategoryRequest = {
  readonly parent_id?: string;
  readonly name: string;
  readonly description?: string;
};

export type DshUpdateCategoryRequest = {
  readonly parent_id?: string;
  readonly name?: string;
  readonly description?: string;
};

export type DshListCategoriesResponse = {
  readonly categories: readonly DshCategoryRecord[];
  readonly pagination: {
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
  };
};

// ─── Transport contract ────────────────────────────────────────────────────────

export type DshProductApiTransport = {
  post(path: string, body: unknown): Promise<any>;
  patch(path: string, body: unknown): Promise<any>;
  get(path: string): Promise<unknown>;
  delete(path: string): Promise<void>;
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

  createCategory(
    storeId: string,
    req: DshCreateCategoryRequest,
  ): Promise<DshCategoryRecord>;

  updateCategory(
    categoryId: string,
    req: DshUpdateCategoryRequest,
  ): Promise<DshCategoryRecord>;

  getCategory(categoryId: string): Promise<DshCategoryRecord>;

  listCategories(
    storeId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<DshListCategoriesResponse>;

  deleteCategory(categoryId: string): Promise<void>;

  uploadProductMedia(req: DshUploadProductMediaRequest): Promise<DshProductMediaRecord>;
  deleteProductMedia(mediaId: string): Promise<void>;
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

    createCategory: (storeId, req) =>
      transport.post(`/stores/${storeId}/categories`, req),

    updateCategory: (categoryId, req) =>
      transport.patch(`/categories/${categoryId}`, req),

    getCategory: (categoryId) =>
      transport.get(`/categories/${categoryId}`) as Promise<DshCategoryRecord>,

    listCategories: (storeId, options = {}) => {
      const params = new URLSearchParams();
      if (options.limit !== undefined) params.set('limit', String(options.limit));
      if (options.offset !== undefined) params.set('offset', String(options.offset));
      const qs = params.toString();
      const path = qs ? `/stores/${storeId}/categories?${qs}` : `/stores/${storeId}/categories`;
      return transport.get(path) as Promise<DshListCategoriesResponse>;
    },

    deleteCategory: (categoryId) =>
      transport.delete(`/categories/${categoryId}`),

    uploadProductMedia: (req) =>
      transport.post('/media', req),

    deleteProductMedia: (mediaId) =>
      transport.delete(`/media/${mediaId}`),
  };
}
