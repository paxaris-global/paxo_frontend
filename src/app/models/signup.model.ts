/**
 * Admin user for signup.
 * Used in SignupRequest and signup form-data.
 */
export interface SignupAdminUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

/**
 * Signup request body (JSON).
 * POST /identity/signup (when sending JSON only)
 * Or as "data" field in form-data when uploading file.
 */
export interface SignupRequest {
  realmName: string;
  clientId: string;
  url: string;
  uri: string;
  publicClient: boolean;
  adminUser: SignupAdminUser;
}
