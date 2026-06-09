import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  NotificationModalService,
  NotificationModalState,
} from '../../../services/notification-modal.service';

@Component({
  selector: 'app-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.css'],
})
export class StatusModalComponent implements OnInit, OnDestroy {
  state: NotificationModalState = {
    visible: false,
    type: 'success',
    title: '',
  };

  private subscription?: Subscription;

  constructor(private readonly notificationModal: NotificationModalService) {}

  ngOnInit(): void {
    this.subscription = this.notificationModal.state$.subscribe((state) => {
      this.state = state;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(): void {
    this.notificationModal.close();
  }

  onBackdropClick(): void {
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state.visible) {
      this.close();
    }
  }
}
