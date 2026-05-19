# KeycloakClientFrontends

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## CI/CD (GitHub Actions)

On push to `main`, workflow **Build and Deploy Paxo Frontend** (`.github/workflows/ci.yml`) builds the Docker image, pushes to Docker Hub, and updates `paxaris-global/paxo` `k8/paxo-frontend-deployment.yaml` so Argo CD rolls out the cluster.

Configure these **repository secrets** under *Settings → Secrets and variables → Actions*:

| Secret | Purpose |
|--------|---------|
| `DOCKER_HUB_USERNAME` + `DOCKER_HUB_TOKEN` | Docker Hub login (preferred) |
| `DOCKER_USERNAME` + `DOCKER_PASSWORD` | Legacy Docker Hub secret names |
| `GH_ACCESS_TOKEN` or `PAXO_GITOPS_TOKEN` | Classic GitHub PAT with `repo` write on `paxaris-global/paxo` ([create token](https://github.com/settings/tokens/new)) — **not** your GitHub password |

If a step fails with **Bad credentials**, create a new PAT and update the secret; enable SSO for the Paxaris org if required.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4300/`. The application will automatically reload whenever you modify any of the source files. The dev server proxy reads `PAXO_GATEWAY_LOCAL_PORT` if your gateway port-forward is not on `8085`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.







echo "# paxo_frontend" >> README.md



