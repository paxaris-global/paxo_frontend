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

  uploadBanner(
    realm: string,
    productId: string,
    bannerImage: File,
    productName?: string,
    description?: string
  ): Observable<ProductShowcaseCard> {
    const token = getStoredToken();
    const formData = new FormData();
    formData.append('bannerImage', bannerImage);
    if (productName?.trim()) {
      formData.append('productName', productName.trim());
    }
    if (description?.trim()) {
      formData.append('description', description.trim());
    }
    return this.http
      .post<ProductShowcaseCard>(
        `${this.base()}/${encodeURIComponent(realm)}/${encodeURIComponent(productId)}/banner`,
        formData,
        {
          headers: token
            ? new HttpHeaders({ Authorization: `Bearer ${token}` })
            : undefined,
        }
      )
      .pipe(map((item) => this.normalizeCard(item)));
  }

  saveCatalogDescription(
    realm: string,
    productId: string,
    description: string
  ): Observable<ProductShowcaseCard> {
    const token = getStoredToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return this.http
      .put<ProductShowcaseCard>(
        `${this.base()}/${encodeURIComponent(realm)}/${encodeURIComponent(productId)}/description`,
        { description: description.trim() },
        { headers }
      )
      .pipe(map((item) => this.normalizeCard(item)));
  }

  captureShowcase(
    realm: string,
    productId: string,
    productName?: string,
    description?: string
  ): Observable<ProductShowcaseCard> {
    const token = getStoredToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    const body: { productName: string; description?: string } = {
      productName: productName || productId,
    };
    if (description?.trim()) {
      body.description = description.trim();
    }
    return this.http
      .post<ProductShowcaseCard>(
        `${this.base()}/${encodeURIComponent(realm)}/${encodeURIComponent(productId)}/capture`,
        body,
        { headers }
      )
      .pipe(map((item) => this.normalizeCard(item)));
  }

  private normalizeCard(item: ProductShowcaseCard): ProductShowcaseCard {
    return {
      ...item,
      frontendUrl: resolveProductFrontendUrl(
        item.frontendUrl,
        item.realmName,
        item.productId
      ),
    };
  }
}
