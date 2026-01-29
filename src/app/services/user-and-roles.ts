import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRolesPayload } from '../models/role-creation.model';
import { ApiGatewayService } from './api-gateway.service';

/**
 * Thin wrapper over ApiGatewayService for user/role operations.
 * Use ApiGatewayService directly for new code; this service remains for compatibility.
 */
@Injectable({
  providedIn: 'root',
})
export class UserAndRolesService {
  constructor(private apiGateway: ApiGatewayService) {}

  /**
   * Create roles for a client.
   * POST /identity/{realm}/clients/{clientId}/roles
   */
  createRoles(
    realm: string,
    clientId: string,
    payload: CreateRolesPayload
  ): Observable<any> {
    return this.apiGateway.createRoles(realm, clientId, payload);
  }
}
