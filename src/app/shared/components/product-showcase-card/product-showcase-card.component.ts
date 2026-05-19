import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductShowcaseCard } from '../../../models/product-showcase.model';
import {
  resolveProductFrontendUrl,
  resolveShowcasePreviewImage,
} from '../../../utils/product-showcase-url.util';

@Component({
  selector: 'app-product-showcase-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-showcase-card.component.html',
  styleUrls: ['./product-showcase-card.component.css'],
})
export class ProductShowcaseCardComponent {
  @Input({ required: true }) product!: ProductShowcaseCard;

  readonly fallbackImage =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22900%22 height=%22520%22%3E%3Crect fill=%22%231d4ed8%22 width=%22100%25%22 height=%22100%25%22/%3E%3C/svg%3E';

  get previewSrc(): string {
    return resolveShowcasePreviewImage(this.product.previewImage, this.fallbackImage);
  }

  get openProductUrl(): string {
    return resolveProductFrontendUrl(this.product.frontendUrl);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.src = this.fallbackImage;
    }
  }
}
