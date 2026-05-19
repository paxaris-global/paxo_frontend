import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiGatewayBaseUrl } from '../../environments/environment';
import { getStoredToken } from '../auth-storage';
import { ProductShowcaseCard } from '../models/product-showcase.model';
import { resolveProductFrontendUrl } from '../utils/product-showcase-url.util';

@Injectable({
  providedIn: 'root',
})
export class ProductShowcaseService {
  private base(): string {
    // Same-origin path proxied to api-gateway (see proxy.conf.js and nginx default.conf)
    return `${getApiGatewayBaseUrl()}/project/showcases`;
  }

  constructor(private http: HttpClient) {}

  listShowcases(realm?: string): Observable<ProductShowcaseCard[]> {
    const query = realm ? `?realm=${encodeURIComponent(realm)}` : '';
    return this.http
      .get<ProductShowcaseCard[]>(`${this.base()}${query}`)
      .pipe(map((items) => (items ?? []).map((item) => this.normalizeCard(item))));
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
    return this.http
      .post<ProductShowcaseCard>(
        `${this.base()}/${encodeURIComponent(realm)}/${encodeURIComponent(productId)}/capture`,
        { productName: productName || productId },
        { headers }
      )
      .pipe(map((item) => this.normalizeCard(item)));
  }

  private normalizeCard(item: ProductShowcaseCard): ProductShowcaseCard {
    return {
      ...item,
      frontendUrl: resolveProductFrontendUrl(item.frontendUrl),
    };
  }
}
