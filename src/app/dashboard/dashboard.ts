import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../services/dashboard';
import { ApiGatewayService } from '../services/api-gateway.service';
import { getStoredRealm, setStoredRealm } from '../auth-storage';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  realmName = 'Unknown Realm';
  products: any[] = [];
  loadingProducts = false;
  usersAndRolesMenuOpen = true;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private apiGateway: ApiGatewayService
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const realmFromQuery = params['realm'];
      if (realmFromQuery) {
        this.realmName = realmFromQuery;
        setStoredRealm(realmFromQuery);
        this.loadProducts();
      } else {
        this.realmName = getStoredRealm() || 'Unknown Realm';
        this.loadProducts();
        this.dashboardService.getRealmUser().subscribe({
          next: (realm) => {
            const name = (realm?.trim() || getStoredRealm()) || 'Unknown Realm';
            this.realmName = name;
            if (name !== 'Unknown Realm') {
              setStoredRealm(name);
              this.loadProducts();
            } else {
              this.products = [];
              this.loadingProducts = false;
            }
          },
          error: () => {
            this.realmName = getStoredRealm() || 'Unknown Realm';
            if (this.realmName !== 'Unknown Realm') {
              this.loadProducts();
            } else {
              this.products = [];
              this.loadingProducts = false;
            }
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducts(): void {
    if (!this.realmName || this.realmName === 'Unknown Realm') {
      this.products = [];
      this.loadingProducts = false;
      return;
    }
    this.loadingProducts = true;
    this.apiGateway.getProducts(this.realmName).subscribe({
      next: (data: any) => {
        this.products = data ?? [];
        this.loadingProducts = false;
      },
      error: () => {
        this.products = [];
        this.loadingProducts = false;
      },
    });
  }
}
