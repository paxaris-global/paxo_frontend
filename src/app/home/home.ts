import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductShowcaseCard } from '../models/product-showcase.model';
import { ProductShowcaseService } from '../services/product-showcase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  readonly stats = [
    { value: 'AI', label: 'Product generation' },
    { value: 'K8s', label: 'Runtime platform' },
    { value: 'GitOps', label: 'Delivery model' },
  ];

  showcaseProducts: ProductShowcaseCard[] = [];
  showcasesLoading = true;
  showcasesError = '';
  showAllProducts = false;
  carouselIndex = 0;
  cardsPerView = 1;

  @ViewChild('carouselViewport') carouselViewport?: ElementRef<HTMLElement>;

  private carouselScrollListener?: () => void;

  readonly aiHighlights = [
    'Prompt to product structure',
    'Spring Boot backend and Angular frontend',
    'Download source or move into Paxo provisioning',
  ];

  constructor(
    private showcaseService: ProductShowcaseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.updateCardsPerView();
    this.showcaseService.listShowcases().subscribe({
      next: (items) => {
        this.showcaseProducts = items ?? [];
        this.showcasesLoading = false;
        this.clampCarouselIndex();
        if (isPlatformBrowser(this.platformId)) {
          queueMicrotask(() => this.bindCarouselScrollSync());
        }
      },
      error: () => {
        this.showcasesError = 'Could not load provisioned products.';
        this.showcasesLoading = false;
      },
    });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    queueMicrotask(() => this.bindCarouselScrollSync());
  }

  ngOnDestroy() {
    this.unbindCarouselScrollSync();
  }

  @HostListener('window:resize')
  onWindowResize() {
    const previous = this.cardsPerView;
    this.updateCardsPerView();
    if (previous !== this.cardsPerView) {
      this.clampCarouselIndex();
      this.scrollCarouselToIndex(false);
    }
  }

  get maxCarouselIndex(): number {
    return Math.max(0, this.showcaseProducts.length - this.cardsPerView);
  }

  get canCarouselPrev(): boolean {
    return this.carouselIndex > 0;
  }

  get canCarouselNext(): boolean {
    return this.carouselIndex < this.maxCarouselIndex;
  }

  get carouselPageCount(): number {
    return this.maxCarouselIndex + 1;
  }

  get carouselDotIndexes(): number[] {
    return Array.from({ length: this.carouselPageCount }, (_, index) => index);
  }

  get carouselVisibleEnd(): number {
    return Math.min(this.showcaseProducts.length, this.carouselIndex + this.cardsPerView);
  }

  toggleShowAll(): void {
    this.showAllProducts = !this.showAllProducts;
    if (this.showAllProducts) {
      this.unbindCarouselScrollSync();
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      queueMicrotask(() => {
        this.bindCarouselScrollSync();
        this.scrollCarouselToIndex(false);
      });
    }
  }

  prevCarousel(): void {
    this.goToCarouselIndex(this.carouselIndex - 1);
  }

  nextCarousel(): void {
    this.goToCarouselIndex(this.carouselIndex + 1);
  }

  goToCarouselIndex(index: number): void {
    const next = Math.min(this.maxCarouselIndex, Math.max(0, index));
    this.carouselIndex = next;
    this.scrollCarouselToIndex(true);
  }

  private scrollCarouselToIndex(animate: boolean): void {
    const viewport = this.carouselViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    const slide = viewport.querySelector('.carousel-slide') as HTMLElement | null;
    const gap = 20;
    const step = (slide?.offsetWidth ?? viewport.clientWidth) + gap;
    viewport.scrollTo({
      left: this.carouselIndex * step,
      behavior: animate ? 'smooth' : 'auto',
    });
  }

  private bindCarouselScrollSync(): void {
    const viewport = this.carouselViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    this.unbindCarouselScrollSync();
    this.carouselScrollListener = () => {
      const slide = viewport.querySelector('.carousel-slide') as HTMLElement | null;
      const gap = 20;
      const step = (slide?.offsetWidth ?? viewport.clientWidth) + gap;
      if (step <= 0) {
        return;
      }
      const index = Math.round(viewport.scrollLeft / step);
      this.carouselIndex = Math.min(this.maxCarouselIndex, Math.max(0, index));
    };
    viewport.addEventListener('scroll', this.carouselScrollListener, { passive: true });
  }

  private unbindCarouselScrollSync(): void {
    const viewport = this.carouselViewport?.nativeElement;
    if (viewport && this.carouselScrollListener) {
      viewport.removeEventListener('scroll', this.carouselScrollListener);
    }
    this.carouselScrollListener = undefined;
  }

  private updateCardsPerView(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.cardsPerView = 1;
      return;
    }
    const width = window.innerWidth;
    if (width >= 980) {
      this.cardsPerView = 3;
    } else if (width >= 680) {
      this.cardsPerView = 2;
    } else {
      this.cardsPerView = 1;
    }
  }

  private clampCarouselIndex(): void {
    this.carouselIndex = Math.min(this.maxCarouselIndex, Math.max(0, this.carouselIndex));
  }
}
