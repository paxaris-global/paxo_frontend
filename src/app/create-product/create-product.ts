import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { KeycloakService } from '../services/keycloak';
import { ProductShowcaseService } from '../services/product-showcase.service';
import { getStoredRealm } from '../auth-storage';
import {
  CreateProductProgressStep,
  buildInitialProgressSteps,
} from '../models/create-product-progress.model';
import { Subscription, interval, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrls: ['./create-product.css'],
})
export class CreateProductComponent implements OnInit, OnDestroy {
  /** All provisioned products use a public Keycloak client (browser username/password login). */
  private static readonly PUBLIC_CLIENT = true;

  productForm: FormGroup;
  selectedBackendZip: File | null = null;
  selectedFrontendZip: File | null = null;
  selectedBannerImage: File | null = null;
  bannerPreviewUrl: string | null = null;
  responseMessage = '';

  isCreating = false;
  progressPercent = 0;
  progressSteps: CreateProductProgressStep[] = buildInitialProgressSteps();
  currentStepLabel = '';

  private deploySimulationSub?: Subscription;
  private pollSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private keycloakService: KeycloakService,
    private showcaseService: ProductShowcaseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.productForm = this.buildProductForm();
  }

  ngOnInit() {}

  private buildProductForm(): FormGroup {
    return this.fb.group({
      realm: [{ value: getStoredRealm() || '', disabled: true }],
      productId: [''],
    });
  }

  ngOnDestroy() {
    this.stopDeploySimulation();
    this.pollSub?.unsubscribe();
    this.revokeBannerPreview();
  }

  onBackendZipSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.selectedBackendZip = file;
  }

  onFrontendZipSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.selectedFrontendZip = file;
  }

  onBannerImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      this.responseMessage = '⚠️ Banner must be JPEG, PNG, WebP, or GIF.';
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.responseMessage = '⚠️ Banner image must be 5 MB or smaller.';
      input.value = '';
      return;
    }
    this.revokeBannerPreview();
    this.selectedBannerImage = file;
    this.bannerPreviewUrl = URL.createObjectURL(file);
    this.responseMessage = '';
  }

  private revokeBannerPreview() {
    if (this.bannerPreviewUrl) {
      URL.revokeObjectURL(this.bannerPreviewUrl);
      this.bannerPreviewUrl = null;
    }
  }

  createProduct() {
    const realm = (this.productForm.getRawValue().realm || '').trim();
    const productId = (this.productForm.get('productId')?.value || '').trim();

    if (!realm || !productId) {
      this.responseMessage = '⚠️ Realm and Product ID are required.';
      return;
    }

    if (!this.selectedBackendZip || !this.selectedFrontendZip) {
      this.responseMessage = '⚠️ Backend ZIP and Frontend ZIP are required.';
      return;
    }

    const productPayload = {
      productId,
      publicClient: CreateProductComponent.PUBLIC_CLIENT,
    };

    this.beginProgress();
    this.setStepActive('urls');
    this.responseMessage = '';

    this.keycloakService.createProductInKeycloak(realm, productPayload).subscribe({
      next: (kcRes: any) => {
        this.setStepDone('urls', 'NodePorts and public URLs reserved');
        this.setStepDone('keycloak', kcRes?.message || 'Keycloak client created');

        const kcUrl = kcRes?.token?.frontendBaseUrl;
        const hasBanner = !!this.selectedBannerImage;

        const startDeploy = () => {
          this.setStepActive('extract');
          this.startDeploySimulation();

          this.keycloakService
            .provisionProductViaProjectManager(
              realm,
              productId,
              this.selectedBackendZip!,
              this.selectedFrontendZip!
            )
            .subscribe({
              next: (res: any) => {
                this.stopDeploySimulation();
                this.applyDeployResponseSteps(res);
                this.setStepActive('backend');
                this.currentStepLabel = 'Waiting for ArgoCD and pods to become healthy…';
                this.pollUntilRunning(
                  realm,
                  productId,
                  kcUrl || res?.frontendBaseUrl || res?.token?.frontendBaseUrl,
                  hasBanner
                );
              },
              error: (err: any) => {
                this.stopDeploySimulation();
                this.failProgress(err, 'github');
                console.error(err);
              },
            });
        };

        if (hasBanner) {
          this.showcaseService.uploadBanner(realm, productId, this.selectedBannerImage!, productId).subscribe({
            next: () => startDeploy(),
            error: (err: any) => {
              this.failProgress(err, 'urls');
              console.error('Banner upload failed:', err);
            },
          });
        } else {
          startDeploy();
        }
      },
      error: (err: any) => {
        this.failProgress(err, 'keycloak');
        console.error(err);
      },
    });
  }

  private beginProgress() {
    this.isCreating = true;
    this.progressPercent = 0;
    this.progressSteps = buildInitialProgressSteps();
    this.currentStepLabel = 'Starting product creation…';
    this.productForm.disable();
  }

  private finishProgressSuccess(frontendUrl?: string) {
    this.stopDeploySimulation();
    this.pollSub?.unsubscribe();
    this.isCreating = false;
    this.progressPercent = 100;
    this.currentStepLabel = 'Product is live on ArgoCD';
    this.productForm.enable();
    this.productForm.patchValue({ realm: getStoredRealm() || '' });
    this.responseMessage = frontendUrl
      ? `✅ Product is running! Open it at ${frontendUrl}`
      : '✅ Product is running on the cluster.';
    this.productForm.get('productId')?.reset('');
    this.selectedBackendZip = null;
    this.selectedFrontendZip = null;
    this.selectedBannerImage = null;
    this.revokeBannerPreview();
  }

  private failProgress(err: any, failedStepId: string) {
    this.stopDeploySimulation();
    this.pollSub?.unsubscribe();
    this.isCreating = false;
    this.productForm.enable();
    this.productForm.patchValue({ realm: getStoredRealm() || '' });

    const failed = this.progressSteps.find((s) => s.id === failedStepId);
    if (failed) {
      failed.status = 'failed';
      failed.detail = err?.error?.message || err?.message || 'Failed';
    }
    for (const step of this.progressSteps) {
      if (step.status === 'active') {
        step.status = 'failed';
      }
    }

    this.responseMessage =
      '❌ ' + (err?.error?.message || err?.message || 'Create product failed.');
    this.currentStepLabel = 'Provisioning failed';
  }

  private setStepActive(stepId: string, detail?: string) {
    const index = this.progressSteps.findIndex((s) => s.id === stepId);
    for (let i = 0; i < this.progressSteps.length; i++) {
      const step = this.progressSteps[i];
      if (i < index && step.status !== 'done' && step.status !== 'failed') {
        step.status = 'done';
      }
      if (i === index) {
        step.status = 'active';
        if (detail) {
          step.detail = detail;
        }
        this.currentStepLabel = step.label;
      }
      if (i > index && step.status === 'active') {
        step.status = 'pending';
      }
    }
    this.recalculatePercent();
  }

  private setStepDone(stepId: string, detail?: string) {
    const step = this.progressSteps.find((s) => s.id === stepId);
    if (step) {
      step.status = 'done';
      if (detail) {
        step.detail = detail;
      }
    }
    this.recalculatePercent();
  }

  private applyDeployResponseSteps(res: any) {
    const serverSteps: { stepName?: string; status?: string; message?: string }[] =
      res?.steps || [];
    const doneNames = new Set(
      serverSteps.filter((s) => s.status === 'SUCCESS').map((s) => s.stepName)
    );

    if (doneNames.has('Extract Application Code')) {
      this.setStepDone('extract', 'ZIP archives extracted');
    }
    if (doneNames.has('Provision GitHub Repositories')) {
      this.setStepDone('github', 'Repositories and CI configured');
    }
    if (doneNames.has('Generate Kubernetes Manifests')) {
      this.setStepDone('k8', 'Manifests pushed to GitOps');
    }
    if (doneNames.has('Sync ArgoCD Applications')) {
      this.setStepDone('argo', 'ArgoCD apps registered and syncing');
    } else {
      this.setStepDone('extract');
      this.setStepDone('github');
      this.setStepDone('k8');
      this.setStepDone('argo', 'Deployment submitted to ArgoCD');
    }
    this.recalculatePercent();
  }

  private startDeploySimulation() {
    this.stopDeploySimulation();
    let tick = 0;
    this.deploySimulationSub = interval(1800).subscribe(() => {
      tick++;
      const sequence = ['extract', 'github', 'k8', 'argo'] as const;
      const idx = Math.min(Math.floor(tick / 2), sequence.length - 1);
      this.setStepActive(sequence[idx]);
      const cap = 68;
      if (this.progressPercent < cap) {
        this.progressPercent = Math.min(cap, this.progressPercent + 4);
      }
    });
  }

  private stopDeploySimulation() {
    this.deploySimulationSub?.unsubscribe();
    this.deploySimulationSub = undefined;
  }

  private pollUntilRunning(
    realm: string,
    productId: string,
    frontendUrl?: string,
    hasCustomBanner = false
  ) {
    this.pollSub?.unsubscribe();
    const maxAttempts = 80;
    let attempts = 0;

    this.pollSub = timer(0, 4000)
      .pipe(switchMap(() => this.keycloakService.getProductDeploymentStatus(realm, productId)))
      .subscribe({
        next: (status: any) => {
          attempts++;
          const serverPercent = Number(status?.progressPercent ?? 0);
          this.progressPercent = Math.max(
            this.progressPercent,
            Math.min(99, 70 + Math.round(serverPercent * 0.3))
          );

          if (status?.backendReady) {
            this.setStepDone('backend', status?.message || 'Backend API is healthy');
          } else {
            this.setStepActive('backend', status?.message || 'Starting backend, Postgres, and Redis…');
          }

          if (status?.frontendReady) {
            this.setStepDone('frontend', status?.frontendBaseUrl || 'Frontend is serving traffic');
          } else if (status?.backendReady) {
            this.setStepActive('frontend', 'Waiting for frontend pod…');
          }

          if (status?.ready) {
            this.pollSub?.unsubscribe();
            this.setStepDone('backend');
            this.setStepDone('frontend');
            if (!hasCustomBanner) {
              this.captureShowcase(realm, productId);
            }
            this.finishProgressSuccess(status?.frontendBaseUrl || frontendUrl);
            return;
          }

          if (attempts >= maxAttempts) {
            this.pollSub?.unsubscribe();
            this.failProgress(
              { message: 'Timed out waiting for the product to become healthy on ArgoCD' },
              'backend'
            );
          }
        },
        error: () => {
          attempts++;
          if (attempts >= maxAttempts) {
            this.pollSub?.unsubscribe();
            this.failProgress(
              { message: 'Could not verify deployment status from the cluster' },
              'backend'
            );
          }
        },
      });
  }

  private captureShowcase(realm: string, productId: string) {
    this.showcaseService.captureShowcase(realm, productId, productId).subscribe({
      next: () => {},
      error: (err) => console.warn('Showcase capture failed (home catalog may be stale):', err),
    });
  }

  private recalculatePercent() {
    const total = this.progressSteps.reduce((sum, s) => sum + s.weight, 0);
    let done = 0;
    let activeWeight = 0;
    for (const step of this.progressSteps) {
      if (step.status === 'done') {
        done += step.weight;
      } else if (step.status === 'active') {
        activeWeight = step.weight * 0.45;
      }
    }
    this.progressPercent = Math.min(99, Math.round(((done + activeWeight) / total) * 100));
  }

  get doneStepCount(): number {
    return this.progressSteps.filter((s) => s.status === 'done').length;
  }
}
