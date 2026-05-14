import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomePage {
  readonly stats = [
    { value: 'AI', label: 'Product generation' },
    { value: 'K8s', label: 'Runtime platform' },
    { value: 'GitOps', label: 'Delivery model' },
  ];

  readonly products = [
    {
      name: 'Identity Console',
      tag: 'Keycloak',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
      description: 'Manage realms, users, client products, product secrets, and role assignments from one UI.',
    },
    {
      name: 'Product Provisioning',
      tag: 'Kubernetes',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      description: 'Upload backend and frontend ZIPs, generate repos, allocate NodePorts, and publish product URLs.',
    },
    {
      name: 'Generate Product Using AI',
      tag: 'Python Foundry',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
      description: 'Describe your idea and generate Spring Boot plus Angular product source with an AI workflow.',
    },
  ];

  readonly aiHighlights = [
    'Prompt to product structure',
    'Spring Boot backend and Angular frontend',
    'Download source or move into Paxo provisioning',
  ];
}
