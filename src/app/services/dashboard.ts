import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

/**
 * Dashboard-related API calls. Delegates to ApiGatewayService.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiGateway: ApiGatewayService) {}

  /**
   * Get the realm to display (from GET /identity/realms/user).
   */
  getRealmUser(): Observable<string> {
    return this.apiGateway.getRealmUser();
  }
}
