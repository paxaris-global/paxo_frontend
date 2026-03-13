/**
 * Login request body.
 * POST /identity/{realm}/login
 */
export interface LoginRequest {
  username: string;
  password: string;
  client_id: string;
  client_secret?: string;
}

/**
 * Login response (Keycloak token response + custom fields).
 */
export interface LoginResponse {
  access_token: string;
  expires_in?: number;
  token_type?: string;
  refresh_token?: string;
  refresh_expires_in?: number;
  base_url?: string;
  redirect_url?: string;
  scope?: string;
  [key: string]: unknown;
}

export interface RefreshTokenRequest {
  refresh_token: string;
  client_id: string;
  product_id?: string;
}
