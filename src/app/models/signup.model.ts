/**
 * Signup request body (JSON).
 * POST /identity/signup
 * Matches identity_service SignupRequest.
 */
export interface SignupRequest {
  realmName: string;
  adminPassword: string;
  /** Optional; backend defaults to configured identity.default-admin.username */
  adminUsername?: string;
}
