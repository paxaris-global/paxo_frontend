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
  readonly capabilities = [
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Identity and Access',
      description: 'Create realms, users, products, roles, and URI permissions backed by Keycloak.',
    },
    {
      icon: 'fa-solid fa-cloud-arrow-up',
      title: 'Product Provisioning',
      description: 'Upload backend and frontend ZIPs, allocate Kubernetes ports, and publish product URLs.',
    },
    {
      icon: 'fa-solid fa-diagram-project',
      title: 'GitOps Deployment',
      description: 'Generate repositories, build Docker images, and sync workloads through Argo CD.',
    },
    {
      icon: 'fa-solid fa-wand-magic-sparkles',
      title: 'AI Product Generator',
      description: 'Use Python Foundry to generate Spring Boot and Angular products from a prompt.',
    },
  ];

  readonly flow = [
    'Create realm and admin access',
    'Create product from backend/frontend ZIPs',
    'Paxo allocates NodePorts and stores URLs',
    'Keycloak receives the generated frontend URL',
    'Argo CD syncs the product into Kubernetes',
  ];
}
