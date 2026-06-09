import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationModalType = 'success' | 'error' | 'warning';

export interface NotificationModalState {
  visible: boolean;
  type: NotificationModalType;
  title: string;
  detail?: string;
}

const hidden: NotificationModalState = {
  visible: false,
  type: 'success',
  title: '',
  detail: undefined,
};

@Injectable({ providedIn: 'root' })
export class NotificationModalService {
  private readonly stateSubject = new BehaviorSubject<NotificationModalState>(hidden);
  readonly state$ = this.stateSubject.asObservable();

  success(title: string, detail?: string): void {
    this.open('success', title, detail);
  }

  error(title: string, detail?: string): void {
    this.open('error', title, detail);
  }

  warning(title: string, detail?: string): void {
    this.open('warning', title, detail);
  }

  close(): void {
    this.stateSubject.next(hidden);
  }

  private open(type: NotificationModalType, title: string, detail?: string): void {
    this.stateSubject.next({
      visible: true,
      type,
      title,
      detail: detail?.trim() || undefined,
    });
  }
}
