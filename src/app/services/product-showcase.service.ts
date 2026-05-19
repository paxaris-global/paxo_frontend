import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiGatewayBaseUrl } from '../../environments/environment';
import { getStoredToken } from '../auth-storage';
import { ProductShowcaseCard } from '../models/product-showcase.model';

@Injectable({
  providedIn: 'root',
})
export class ProductShowcaseService {
  private base(): string {
    return `${getApiGatewayBaseUrl()}/api/v1/project/showcases`;
  }

  constructor(private http: HttpClient) {}

  listShowcases(realm?: string): Observable<ProductShowcaseCard[]> {
    const query = realm ? `?realm=${encodeURIComponent(realm)}` : '';
    return this.http.get<ProductShowcaseCard[]>(`${this.base()}${query}`);
  }

  captureShowcase(
    realm: string,
    productId: string,
    productName?: string
  ): Observable<ProductShowcaseCard> {
    const token = getStoredToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return this.http.post<ProductShowcaseCard>(
      `${this.base()}/${encodeURIComponent(realm)}/${encodeURIComponent(productId)}/capture`,
      { productName: productName || productId },
      { headers }
    );
  }
}
