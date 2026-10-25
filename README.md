# super-app

A TypeScript monorepo containing the web application, administration portal, and ML application for the `super-app` platform.

> **Project status:** This document describes the currently known repository architecture. Planned security, infrastructure, and backend improvements are not considered implemented unless verified in the codebase.

## Applications

| Application | Path             | Default development port |
| ----------- | ---------------- | -----------------------: |
| Web App     | `apps/web-app`   |                   `3000` |
| Admin App   | `apps/admin-app` |                   `3001` |
| ML App      | `apps/ml-app`    |                   `3002` |

The applications use Next.js and React and share code through workspace packages.

## Repository Structure

```text
super-app/
├── apps/
│   ├── web-app/
│   ├── admin-app/
│   └── ml-app/
├── packages/
│   ├── shared/
│   ├── core/
│   └── store/
├── features/
│   ├── auth/
│   ├── ai-chat/
│   ├── chat-core/
│   └── assistant-chat/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

This is a high-level overview. Verify the current repository tree before relying on individual paths or package names.

## Technology Stack

- TypeScript
- Next.js 16
- React 19
- pnpm workspaces
- Turborepo
- Auth.js v5 and OpenIddict for authentication
- IndexedDB and Dexie for local chat persistence
- MQTT over WebSocket for chat reply events

Additional libraries and service integrations may be used by individual applications.

## Applications

### Web App

The user-facing application provides chat and profile-related functionality. It integrates with authentication services, AI chat APIs, chat history services, and realtime messaging.

See [`apps/web-app/README.md`](apps/web-app/README.md).

### Admin App

The administration portal provides management interfaces, SSO integration, a server-side BFF route for admin requests, and interfaces related to document management and RAG services.

See [`apps/admin-app/README.md`](apps/admin-app/README.md).

### ML App

The ML application contains an ML-oriented application shell and chat-related UI. Some pages are currently placeholders; verify individual features before treating them as production-ready.

See [`apps/ml-app/README.md`](apps/ml-app/README.md).

## Prerequisites

- A Node.js version compatible with the repository configuration
- The pnpm version specified by the project, if pinned
- Access to the repository's package registry and dependencies
- Valid local configuration for any external services required by the application being run

## Installation

Run the following command from the repository root:

```bash
pnpm install
```

## Development

The repository uses pnpm workspaces and Turborepo. The exact script names and workspace filters must match the current `package.json` files.

Common command patterns include:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm type-check
```

These commands are available only if defined by the root package scripts.

To run an individual application, inspect its `package.json` and use its actual workspace name. For example:

```bash
pnpm --filter <workspace-name> dev
```

Do not assume that a directory name and its declared workspace name are identical.

## Environment Configuration

Each application may require configuration for authentication, backend APIs, and external services.

- Use local environment files only when required by the project.
- Never commit real credentials, access tokens, or private keys.
- Do not expose secrets through `NEXT_PUBLIC_*` variables.
- Use non-sensitive placeholders in example environment files.
- Configure production secrets through the deployment environment or an approved secret-management system.

Refer to each application's README and the actual configuration code for the required variable names.

## Architecture Overview

The repository is primarily a frontend monorepo. Backend APIs and infrastructure services are external dependencies rather than backend services implemented within this repository.

Known integrations include:

- OpenIddict-based identity services
- Administrative APIs
- AI chat and chat history APIs
- Document and vector-search services
- MQTT over WebSocket
- Text-to-speech and voice-related services
- LiveKit token services

Availability, authentication requirements, and deployment details depend on the external services and their configuration.

## Testing and Quality

Automated test coverage and CI should be verified against the current repository configuration. Before merging changes, run the checks that are actually defined by the project.

Recommended checks include:

- Dependency installation from the lockfile
- Type checking and linting
- Production builds from a clean checkout
- Authentication and authorization tests
- Chat event lifecycle and recovery tests
- API contract tests
- Security regression tests

Do not treat an unconfigured test command as an existing project capability.

## Development Principles

- Preserve the existing `chat-core` and `ai-chat` architectural boundaries unless a demonstrated requirement justifies a change.
- Keep secrets and privileged credentials on the server.
- Enforce authorization in trusted server-side components and backend services.
- Validate external API and realtime payloads.
- Avoid introducing duplicate shared UI or domain logic.
- Prefer small, testable, reversible changes.
- Keep documentation aligned with implemented behavior.

## Design System & Storybook

The design system lives in `packages/shared` (`src/ui`, `src/theme`, `src/tenant`). Storybook documents it and is configured inside that package:

```text
packages/shared/
├── .storybook/        # main.ts, preview.tsx (providers, theme/RTL toolbar), preview.css
└── stories/           # stories are kept outside src so they never reach the tsc -b output
    ├── Introduction.mdx
    ├── foundations/   # colors, typography, radius & shadows
    └── ui/            # one <Component>.stories.tsx per src/ui component
```

```bash
pnpm storybook          # http://localhost:6006
pnpm build:storybook    # packages/shared/storybook-static
```

Conventions: story titles follow `UI/<Category>/<Component>`, stories import components from `src` (no prior build needed), and every new component in `src/ui` should ship with a story. See `stories/Introduction.mdx`.

## Related Documentation

- [`apps/web-app/README.md`](apps/web-app/README.md)
- [`apps/admin-app/README.md`](apps/admin-app/README.md)
- [`apps/ml-app/README.md`](apps/ml-app/README.md)
