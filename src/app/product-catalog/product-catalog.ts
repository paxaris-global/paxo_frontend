import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductShowcaseCard } from '../models/product-showcase.model';
import { ProductShowcaseService } from '../services/product-showcase.service';
import { ProductShowcaseCardComponent } from '../shared/components/product-showcase-card/product-showcase-card.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductShowcaseCardComponent],
  templateUrl: './product-catalog.html',
  styleUrls: ['./product-catalog.css'],
})
export class ProductCatalogPage implements OnInit {
  products: ProductShowcaseCard[] = [];
  filteredProducts: ProductShowcaseCard[] = [];
  loading = true;
  error = '';
  searchQuery = '';

  constructor(private showcaseService: ProductShowcaseService) {}

  ngOnInit(): void {
    this.showcaseService.listShowcases().subscribe({
      next: (items) => {
        this.products = items ?? [];
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load products. Try again in a moment.';
        this.loading = false;
      },
    });
  }

  onSearchChange(): void {
    this.applySearch();
  }

  private applySearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter((product) => {
      const haystack = [
        product.productName,
        product.productId,
        product.realmName,
        product.description,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }
}
