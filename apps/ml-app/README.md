# ML App

The ML-oriented application in the `super-app` monorepo, built with Next.js 16, React 19, and TypeScript.

> **Project status:** The current application includes an ML-oriented shell and chat-related UI. Some pages are placeholders. Verify individual features before considering them complete or production-ready.

## Overview

`ml-app` is one of the three applications in the `super-app` repository.

It provides an application shell for ML-related functionality and includes chat-related UI. The current architecture inventory identifies some pages as placeholders.

The application is part of the frontend monorepo. Model serving, inference, data processing, and other ML workloads should be considered external responsibilities unless their implementations are explicitly present in this repository.

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- pnpm workspaces
- Turborepo
- Shared packages and feature modules from the monorepo, where imported

Refer to `apps/ml-app/package.json` for the actual dependencies and available scripts.

## Responsibilities

The currently known responsibilities include:

- Providing the ML application shell
- Rendering the available chat-related interface
- Integrating with shared application components and packages
- Providing a frontend entry point for ML-related workflows as those workflows are implemented

Do not assume that model training, inference infrastructure, experiment tracking, or ML data pipelines are implemented by this frontend application.

## Architecture Overview

The application is part of a frontend-oriented monorepo.

```text
Browser
   |
   v
ml-app (Next.js)
   |
   +---- Shared workspace packages
   |
   +---- Chat-related UI and features
   |
   +---- External APIs, where configured
```

This diagram is conceptual. It does not imply that all integrations are complete or that the application has a dedicated ML backend.

Before introducing a new backend integration, verify the relevant API contract, authentication mechanism, and existing shared abstractions.

## Current Implementation Status

Some pages in the current application are placeholders.

Before extending a page, determine whether it is:

- A working feature
- A partially implemented feature
- A UI placeholder
- An integration awaiting a backend service
- An obsolete or unused route

Update this README when those states change.

## Shared Code and Architecture

The monorepo contains shared packages and feature modules. Review existing dependencies before adding application-specific copies of shared logic.

The existing chat architecture includes `chat-core` and `ai-chat`. Preserve their current boundaries unless a concrete technical requirement justifies a change.

Prefer explicit interfaces and well-defined contracts when integrating new functionality. Avoid making UI components depend directly on concrete infrastructure adapters when an appropriate abstraction already exists.

## Prerequisites

Before running the application, ensure that you have:

- A Node.js version compatible with the repository configuration
- The pnpm version specified by the project, if pinned
- Access to the repository and its dependencies
- Valid configuration for any external APIs required by the feature being tested

Some pages may run locally without backend access, while integrated functionality may require external services.

## Installation and Development

Run dependency installation from the monorepo root:

```bash
pnpm install
```

Start the application using its declared workspace name:

```bash
pnpm --filter <workspace-name> dev
```

Alternatively, inspect `apps/ml-app/package.json` and run the development script defined there.

The current architecture inventory associates `ml-app` with development port `3002`. Verify the actual script and port configuration before relying on this value.

## Build and Validation

If the relevant scripts are defined, run the application build and checks using the commands configured in the repository.

For example:

```bash
pnpm --filter <workspace-name> build
```

Use the actual workspace name from `apps/ml-app/package.json`.

Check the root `package.json` and `turbo.json` for the supported type-check, lint, and test commands. Do not assume a script exists until it has been verified.

## Environment Configuration

Depending on the implemented features, the application may require configuration for:

- Authentication and OIDC
- Backend API endpoints
- Chat services
- Other external services used by specific ML-related workflows

The actual requirements must be determined from the current application code and configuration.

### Configuration Security

- Never commit secrets, tokens, or private keys.
- Do not expose privileged credentials through `NEXT_PUBLIC_*` variables.
- Keep local environment files out of source control.
- Use non-sensitive placeholders in example configuration.
- Validate and authorize requests at trusted server-side boundaries and backend services.

Do not introduce new public backend URLs or browser-held credentials as a shortcut around missing backend integration.

## Testing and Quality

Before merging changes, verify:

- Dependency installation from the lockfile
- Type checking and linting, where configured
- Production build
- Rendering of implemented pages
- Expected behavior of placeholder pages
- Error handling when external APIs are unavailable
- Authentication and authorization for integrated endpoints
- No leakage of secrets or sensitive payloads

Add tests alongside new features instead of relying exclusively on manual verification.

## Development Guidelines

- Keep the application aligned with the shared monorepo architecture.
- Confirm whether a feature is implemented before documenting it as available.
- Reuse existing shared packages where appropriate.
- Avoid duplicating domain logic across applications.
- Do not suppress type-checking or lint errors to make builds pass.
- Keep security and API contracts explicit.
- Document external dependencies and known limitations.

## Related Documentation

- [`../../README.md`](../../README.md) — monorepo overview, if present
- [`../web-app/README.md`](../web-app/README.md) — user-facing web application
- [`../admin-app/README.md`](../admin-app/README.md) — administration portal
- Architecture audit — current architecture and security findings
- PRD — proposed architecture, security, and reliability improvements

---

**Maintenance note:** Keep this document aligned with the actual code. Update placeholder status, integration requirements, environment configuration, and available scripts as the application evolves.
