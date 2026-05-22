import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  BACKEND_STACK_OPTIONS,
  FRONTEND_STACK_OPTIONS,
  BackendStackId,
  FrontendStackId,
  SupportedBackend,
  SupportedFrontend,
  isSupportedBackend,
  isSupportedFrontend,
} from './stack-options';

type ModePreference = 'auto' | 'reuse' | 'adapt' | 'generate' | 'hybrid_scaffold';
type Phase = 'idle' | 'submitting' | 'polling' | 'done' | 'error';

interface GenerateRequest {
  project_name: string;
  prompt?: string;
  backend: SupportedBackend;
  frontend: SupportedFrontend;
  features: string[];
  website_like?: string;
  mode_preference: ModePreference;
}

interface GenerateResponse {
  job_id: string;
  cache_hit: boolean;
  cached_project_id: string | null;
}

interface Job {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_stage: string;
  error: string | null;
  project_id: string | null;
  stage_timings: Record<string, number>;
}

interface Project {
  id: string;
  name: string;
  description: string;
  backend_stack: string;
  frontend_stack: string;
  domain: string;
  blueprint_used: string | null;
  generated_files: string[];
  validation_report: Record<string, unknown>;
  final_prompt?: string;
}

@Component({
  selector: 'app-python-foundry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './python-foundry.html',
  styleUrls: ['./python-foundry.css'],
})
export class PythonFoundryComponent implements OnDestroy {
  private readonly apiBase = environment.pythonFoundryApiBaseUrl;
  private pollSub: Subscription | null = null;

  readonly backendOptions = BACKEND_STACK_OPTIONS;
  readonly frontendOptions = FRONTEND_STACK_OPTIONS;

  phase: Phase = 'idle';
  projectName = '';
  prompt = '';
  backend: BackendStackId = 'springboot';
  frontend: FrontendStackId = 'angular';
  stackHint = '';
  featuresRaw = '';
  websiteLike = '';
  modePreference: ModePreference = 'auto';

  job: Job | null = null;
  project: Project | null = null;
  errorMessage = '';
  downloading = false;

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  onBackendChange(value: BackendStackId): void {
    if (!isSupportedBackend(value)) {
      this.stackHint = `${this.backendLabel(value)} is not available yet. Choose Java for now.`;
      return;
    }
    this.stackHint = '';
    this.backend = value;
  }

  onFrontendChange(value: FrontendStackId): void {
    if (!isSupportedFrontend(value)) {
      this.stackHint = `${this.frontendLabel(value)} is not available yet. Choose Angular for now.`;
      return;
    }
    this.stackHint = '';
    this.frontend = value;
  }

  private backendLabel(value: BackendStackId): string {
    return this.backendOptions.find((o) => o.value === value)?.label ?? value;
  }

  private frontendLabel(value: FrontendStackId): string {
    return this.frontendOptions.find((o) => o.value === value)?.label ?? value;
  }

  generate(): void {
    const req = this.buildRequest();
    if (!req) return;

    this.reset();
    this.phase = 'submitting';

    this.http.post<GenerateResponse>(`${this.apiBase}/generate`, req).subscribe({
      next: (res) => {
        if (res.cache_hit && res.cached_project_id) {
          this.loadProject(res.cached_project_id);
          return;
        }
        this.startPolling(res.job_id);
      },
      error: (err) => this.fail(this.extractError(err)),
    });
  }

  cancel(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
    this.phase = 'idle';
    this.job = null;
  }

  newGeneration(): void {
    this.reset();
  }

  downloadZip(): void {
    if (!this.project) return;
    this.downloading = true;
    this.http
      .get(`${this.apiBase}/projects/${this.project.id}/download`, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          const blob = response.body;
          if (!blob || blob.size === 0) {
            this.downloading = false;
            this.fail('Download returned an empty file. Generate the project again and retry.');
            return;
          }
          const contentType = response.headers.get('Content-Type') || '';
          if (contentType.includes('application/json')) {
            blob.text().then((text) => {
              this.downloading = false;
              this.fail(this.parseBlobError(text) || 'Download failed.');
            });
            return;
          }
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `${this.project?.name || 'generated-project'}.zip`;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          URL.revokeObjectURL(url);
          this.downloading = false;
        },
        error: (err) => {
          this.downloading = false;
          const status = err?.status;
          if (status === 404) {
            this.fail(
              'Project ZIP not found. Generate a new project (older runs may have been stored only on the worker).',
            );
            return;
          }
          this.fail(this.extractError(err));
        },
      });
  }

  private parseBlobError(text: string): string {
    try {
      const body = JSON.parse(text) as { message?: string; detail?: string };
      return body.message || body.detail || text;
    } catch {
      return text;
    }
  }

  stageLabel(value?: string): string {
    return (value || 'pending')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatTiming(value: unknown): string {
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num < 1 ? `${(num * 1000).toFixed(0)}ms` : `${num.toFixed(1)}s`;
  }

  validationErrors(): string[] {
    const errors = this.project?.validation_report?.['errors'];
    return Array.isArray(errors) ? errors.map(String) : [];
  }

  validationWarnings(): string[] {
    const warnings = this.project?.validation_report?.['warnings'];
    return Array.isArray(warnings) ? warnings.map(String) : [];
  }

  isValidProject(): boolean {
    return this.project?.validation_report?.['valid'] === true;
  }

  stageTimings(): Array<{ key: string; value: number }> {
    return Object.entries(this.job?.stage_timings || {}).map(([key, value]) => ({ key, value }));
  }

  private buildRequest(): GenerateRequest | null {
    const projectName = this.projectName.trim();
    if (!projectName) {
      this.fail('Project name is required.');
      return null;
    }

    if (!isSupportedBackend(this.backend) || !isSupportedFrontend(this.frontend)) {
      this.stackHint = 'Select Java (backend) and Angular (frontend) to generate.';
      return null;
    }

    this.stackHint = '';

    const req: GenerateRequest = {
      project_name: projectName,
      backend: this.backend,
      frontend: this.frontend,
      features: this.featuresRaw
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean),
      mode_preference: this.modePreference,
    };

    if (this.prompt.trim()) req.prompt = this.prompt.trim();
    if (this.websiteLike.trim()) req.website_like = this.websiteLike.trim();

    return req;
  }

  private startPolling(jobId: string): void {
    this.phase = 'polling';
    this.pollSub = timer(0, 3000)
      .pipe(
        switchMap(() => this.http.get<Job>(`${this.apiBase}/jobs/${jobId}`)),
        takeWhile((job) => job.status !== 'completed' && job.status !== 'failed', true),
      )
      .subscribe({
        next: (job) => {
          this.job = job;
          if (job.status === 'completed' && job.project_id) {
            this.loadProject(job.project_id);
          } else if (job.status === 'failed') {
            this.fail(job.error || 'Generation failed.');
          }
        },
        error: (err) => this.fail(this.extractError(err)),
      });
  }

  private loadProject(projectId: string): void {
    this.phase = 'polling';
    this.http.get<Project>(`${this.apiBase}/projects/${projectId}`).subscribe({
      next: (project) => {
        this.project = project;
        this.phase = 'done';
      },
      error: (err) => this.fail(this.extractError(err)),
    });
  }

  private reset(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
    this.phase = 'idle';
    this.job = null;
    this.project = null;
    this.errorMessage = '';
    this.downloading = false;
  }

  private fail(message: string): void {
    this.errorMessage = message;
    this.phase = 'error';
  }

  private extractError(err: any): string {
    return err?.error?.detail || err?.error?.message || err?.message || 'Request failed.';
  }
}
