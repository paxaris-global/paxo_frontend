export type ProgressStepState = 'pending' | 'active' | 'done' | 'failed';

export interface CreateProductProgressStep {
  id: string;
  label: string;
  weight: number;
  status: ProgressStepState;
  detail?: string;
}

export const CREATE_PRODUCT_PIPELINE: Omit<CreateProductProgressStep, 'status'>[] = [
  { id: 'urls', label: 'Reserve product URLs', weight: 8 },
  { id: 'keycloak', label: 'Create Keycloak client', weight: 14 },
  { id: 'extract', label: 'Extract application ZIPs', weight: 8 },
  { id: 'github', label: 'Provision GitHub repositories', weight: 18 },
  { id: 'k8', label: 'Generate Kubernetes manifests', weight: 12 },
  { id: 'argo', label: 'Sync ArgoCD applications', weight: 14 },
  { id: 'backend', label: 'Backend running (DB + API)', weight: 13 },
  { id: 'frontend', label: 'Frontend running on cluster', weight: 13 },
];

export function buildInitialProgressSteps(): CreateProductProgressStep[] {
  return CREATE_PRODUCT_PIPELINE.map((step) => ({ ...step, status: 'pending' as const }));
}
