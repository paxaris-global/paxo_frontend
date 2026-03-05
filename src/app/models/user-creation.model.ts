/**
 * Credential for user creation.
 */
export interface UserCredential {
  type: string;
  value: string;
  temporary: boolean;
}

/**
 * User creation request body.
 * POST /identity/{realm}/users
 * (Postman also shows keycloak/{realm}/users - gateway may route both)
 */
export interface UserCreationRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled?: boolean;
  emailVerified?: boolean;
  credentials?: UserCredential[];
}
