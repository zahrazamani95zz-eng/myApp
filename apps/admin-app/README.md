# Admin App

The administration portal for the `super-app` platform, built with Next.js 16, React 19, and TypeScript.

> **Project status:** This document describes the currently known architecture. Planned security, authorization, and infrastructure improvements are not considered implemented unless verified in the codebase.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Responsibilities](#responsibilities)
- [Architecture and Service Integration](#architecture-and-service-integration)
- [Authentication and SSO](#authentication-and-sso)
- [Document Management and RAG](#document-management-and-rag)
- [Prerequisites](#prerequisites)
- [Installation and Development](#installation-and-development)
- [Environment Configuration](#environment-configuration)
- [Code Structure](#code-structure)
- [Security and Current Limitations](#security-and-current-limitations)
- [Testing and Quality](#testing-and-quality)
- [Related Documentation](#related-documentation)

## Overview

`admin-app` is one of the three applications in the `super-app` monorepo. It provides the administrative user interface and integrates with external administrative and document services.

Its known responsibilities include:

- Providing the administration interface
- Supporting SSO through an OpenID Connect identity provider
- Managing authentication through Auth.js
- Forwarding administrative API requests through an existing Backend-for-Frontend (BFF) route
- Providing interfaces related to document management and Retrieval-Augmented Generation (RAG)

This application is a frontend application. Persistent business data, document processing, and vector retrieval depend on external backend services.

## Technology Stack

| Technology        | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| Next.js 16        | Web application framework                             |
| React 19          | User interface                                        |
| TypeScript        | Type-safe development                                 |
| Auth.js v5        | Authentication and session integration                |
| OpenIddict        | OIDC identity provider and SSO                        |
| pnpm workspaces   | Monorepo package management                           |
| Turborepo         | Task orchestration                                    |
| Next.js BFF route | Server-side forwarding of administrative API requests |

Refer to the application's `package.json` for exact dependency versions and available scripts.

## Responsibilities

### Administration Interface

The application renders administrative pages and components. Client-side validation and UI access controls improve usability, but they are not security boundaries.

### Authentication

The application uses Auth.js v5 with an OpenIddict-based OIDC identity provider. The exact session, callback, refresh-token, and logout behavior depends on the current configuration.

### Administrative API Integration

The existing BFF route is:

```text
/api/admin/[...path]
```

It forwards administrative requests to a backend API. The existence of this route does not mean every API request from the application or every path to a backend service passes through it.

### Document Management and RAG

The application provides interfaces related to document management and integrates with document and retrieval services.

Document processing, embedding generation, vector storage, and retrieval are responsibilities of the corresponding backend services. The availability of individual UI operations must be verified against the actual code and API contracts.

## Architecture and Service Integration

The Admin App is part of a frontend monorepo. Backend APIs and infrastructure services run outside this application.

```text
Browser
   |
   v
admin-app (Next.js)
   |
   +---- Auth.js / OIDC ----> OpenIddict SSO
   |
   +---- /api/admin/* ------> Admin API
   |
   +---- Document API ------> Document / RAG Services
```

This is a conceptual diagram. It does not describe every network path, deployment detail, or security boundary.

### Administrative BFF

The existing `/api/admin/[...path]` route acts as a server-side intermediary for administrative requests. This pattern can reduce direct browser access to the administrative API and provides a potential place for shared security controls.

However, the current BFF must not automatically be assumed to provide all of the following:

- Authorization checks for every operation
- A strict allow-list of permitted destinations and paths
- Complete timeout and upstream error handling
- Streaming support
- Support for every required HTTP method
- Protection for all document-related API calls

These capabilities must be verified against the actual route implementation and backend contracts.

## Authentication and SSO

Sign-in uses an OIDC flow with OpenIddict. Auth.js manages the application's authentication flow and session integration.

### High-Level Flow

1. The user starts the sign-in process in the application.
2. The browser is redirected to the SSO provider.
3. After authentication, the OIDC callback returns control to the application.
4. The application manages the resulting session according to the Auth.js configuration.
5. Administrative requests can be sent through the existing BFF route to the appropriate backend.

Token handling, scopes, refresh behavior, and server-side validation must be verified against the current implementation.

**Important:** A valid session does not automatically grant permission to perform every administrative operation. Backend services must validate access to the relevant resources and operations.

## Document Management and RAG

The document management interface interacts with APIs associated with documents and the RAG infrastructure.

Depending on the implemented pages and API contracts, these capabilities may include:

- Viewing and managing documents
- Submitting document registration or processing requests
- Integrating with document storage and vector-search services
- Making processed documents available to retrieval workflows

Verify each capability against the actual code before treating it as implemented.

### Document Security Considerations

- Authorization for viewing, uploading, deleting, and managing documents must be enforced server-side.
- File validation and size limits must also be enforced at the API boundary.
- Errors from document services must not expose tokens or sensitive information.
- If document APIs are called directly from the browser, their authentication, authorization, CORS policy, and migration to a trusted server-side boundary should be reviewed.

## Prerequisites

Before running the application, ensure that you have:

- A Node.js version compatible with the repository configuration
- The pnpm version specified by the project, if pinned
- Access to the repository and its package registry
- A reachable OpenIddict-based SSO environment
- Network access to the required administrative and document APIs
- Valid local configuration for required external services

## Installation and Development

The following commands are common patterns for a pnpm/Turborepo project. Verify the actual scripts in the root `package.json` and `apps/admin-app/package.json` before running them.

### Install Dependencies

Run from the monorepo root:

```bash
pnpm install
```

### Start the Development Server

If the root scripts support workspace filtering:

```bash
pnpm --filter admin-app dev
```

If the declared workspace name differs, use the actual name from `apps/admin-app/package.json`.

Alternatively, run the application's own development script:

```bash
cd apps/admin-app
pnpm dev
```

Next.js commonly defaults to port `3000`, but the current architecture inventory associates this application with port `3001`. Confirm the actual script and configuration before relying on a specific port.

### Build and Run for Production

If the corresponding scripts are defined:

```bash
pnpm --filter admin-app build
pnpm --filter admin-app start
```

Workspace dependencies may need to be built first. Follow the current Turborepo task graph and package scripts.

## Environment Configuration

The exact environment variable names must be obtained from the Auth.js configuration, OIDC integration, BFF route, and API clients. The following are categories of configuration, not guaranteed variable names:

| Category          | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| Auth.js           | Session secret and required authentication settings      |
| OpenIddict / OIDC | Issuer, client ID, callback URL, and other OIDC settings |
| Admin API         | Backend destination used by the BFF                      |
| Document API      | Destination for document and RAG services                |
| Runtime           | Application port and runtime configuration               |

Inspect these locations to identify the actual variable names:

- `apps/admin-app/package.json`
- Auth.js and OIDC configuration files
- The implementation of `/api/admin/[...path]`
- Existing environment examples, if available
- Root workspace and Turborepo configuration

### Configuration Security

- Never commit secrets to Git.
- Do not put tokens or secrets in `NEXT_PUBLIC_*` variables; these variables are intended for values exposed to the browser.
- Keep local environment files out of source control.
- Use an approved secret-management mechanism in production.
- Use non-sensitive placeholders in example environment files.

## Code Structure

The exact directory layout must be verified against the current repository. The following is a conceptual example, not a claim about the actual directory tree:

```text
apps/
└── admin-app/
    ├── app/                 # Next.js pages and routes, if using App Router
    ├── api/                 # API routes, depending on the current layout
    ├── package.json         # Application dependencies and scripts
    └── README.md
```

Shared monorepo packages may provide common models, UI components, authentication utilities, or domain contracts. Review existing dependencies before adding new implementations to avoid duplicating shared logic.

## Related Documentation

- [`../../README.md`](../../README.md) — monorepo documentation, if present
- [`../web-app/README.md`](../web-app/README.md) — user-facing application
- [`../ml-app/README.md`](../ml-app/README.md) — ML application
- Architecture audit — architecture and security findings
- PRD — proposed architecture, security, and reliability improvements

---

**Maintenance note:** Update this document when API routes, OIDC settings, environment variables, or development scripts change. Document current behavior accurately, and describe planned capabilities as implemented only after the code and tests confirm them.
