/**
 * Create product request body.
 * POST /identity/{realm}/products
 */
export interface CreateProductRequest {
  productId: string;
  publicClient: boolean;
  urls: string[];
}
