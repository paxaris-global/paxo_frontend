/** Stacks shown in Generate Product dropdowns. Only supported entries are sent to Python Foundry. */

export type SupportedBackend = 'springboot';
export type SupportedFrontend = 'angular';

export type BackendStackId =
  | SupportedBackend
  | 'fastapi'
  | 'dotnet'
  | 'go'
  | 'laravel'
  | 'ruby'
  | 'nodejs';

export type FrontendStackId =
  | SupportedFrontend
  | 'react'
  | 'vue'
  | 'nextjs'
  | 'svelte'
  | 'nuxt';

export interface StackOption<T extends string = string> {
  value: T;
  label: string;
  supported: boolean;
}

/** Server-side languages only (no UI frameworks). */
export const BACKEND_STACK_OPTIONS: StackOption<BackendStackId>[] = [
  { value: 'springboot', label: 'Java', supported: true },
  { value: 'fastapi', label: 'Python', supported: false },
  { value: 'dotnet', label: 'C#', supported: false },
  { value: 'go', label: 'Go', supported: false },
  { value: 'laravel', label: 'PHP', supported: false },
  { value: 'ruby', label: 'Ruby', supported: false },
  { value: 'nodejs', label: 'JavaScript', supported: false },
];

/** Client-side / UI languages and frameworks only (no server languages). */
export const FRONTEND_STACK_OPTIONS: StackOption<FrontendStackId>[] = [
  { value: 'angular', label: 'Angular', supported: true },
  { value: 'react', label: 'React', supported: false },
  { value: 'vue', label: 'Vue', supported: false },
  { value: 'nextjs', label: 'Next.js', supported: false },
  { value: 'svelte', label: 'Svelte', supported: false },
  { value: 'nuxt', label: 'Nuxt', supported: false },
];

export function isSupportedBackend(value: string): value is SupportedBackend {
  return value === 'springboot';
}

export function isSupportedFrontend(value: string): value is SupportedFrontend {
  return value === 'angular';
}

export function backendOptionLabel(value: string): string {
  return BACKEND_STACK_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function frontendOptionLabel(value: string): string {
  return FRONTEND_STACK_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
