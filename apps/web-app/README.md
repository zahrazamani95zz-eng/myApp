# Web App

The user-facing web application for the `super-app` platform, built with Next.js 16, React 19, and TypeScript.

> **Project status:** This document describes the currently known architecture. Planned BFF, security, and realtime improvements must not be considered implemented until verified in the codebase.

## Overview

The Web App provides the main user-facing experience, including chat and profile-related functionality. It integrates with authentication, AI chat, history, and realtime messaging services.

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Auth.js v5
- OpenIddict / OpenID Connect
- IndexedDB and Dexie for local persistence
- MQTT over WebSocket for realtime chat events
- Shared workspace packages and feature modules

Refer to the application's `package.json` for the exact dependency versions and available scripts.

## Main Responsibilities

- User-facing chat interface
- Authentication and session integration
- Sending chat requests to the AI backend
- Receiving asynchronous chat replies
- Accessing conversation history and feedback APIs
- Local chat persistence
- Integration with voice-related services where supported

## Architecture Overview

The current chat flow combines HTTP requests with realtime event delivery.

```text
Browser
   |
   +---- Auth.js / OIDC ----> OpenIddict
   |
   +---- HTTP --------------> AI Chat API
   |
   +---- HTTP --------------> History / Feedback APIs
   |
   +---- MQTT over WebSocket -> Realtime Reply Events
   |
   +---- IndexedDB / Dexie --> Local Chat Data
```

This diagram is conceptual. It does not imply that all API calls pass through a centralized BFF or that all external services use the same authentication mechanism.

## Authentication

The application uses Auth.js v5 with an OpenIddict-based OIDC identity provider.

The authentication configuration is responsible for the application's sign-in flow and session handling. Exact token handling, refresh behavior, callback URLs, and logout semantics must be verified in the current implementation.

A valid frontend session does not automatically prove that a separate backend API or MQTT broker has authenticated and authorized the request.

## Chat Request and Realtime Reply Flow

The known chat implementation uses an HTTP request to submit a chat completion request and MQTT over WebSocket to receive asynchronous reply events.

The current realtime topic pattern is:

```text
hermes/chat/{chatId}/replies
```

The precise subscription timing, authorization model, payload contract, and reconnect behavior must be verified against the running backend and broker configuration.

### Reliability Considerations

The architecture audit identified several areas requiring attention:

- Subscription timing may allow a reply event to arrive before the client is ready to receive it.
- Event listeners must be unsubscribed when their owning components or runtimes are disposed.
- Duplicate and out-of-order events need explicit handling.
- A final response should not be inferred solely from a heuristic.
- Reconnect and missed-message recovery require a defined protocol.
- Client retries need backend-supported idempotency to prevent duplicate operations.

These are known audit concerns, not claims that every request currently fails.

## Local Persistence

The application uses IndexedDB through Dexie for local chat data and can combine local state with history returned by the backend.

Local persistence improves responsiveness and can support continued access to locally stored conversations. It also introduces user-isolation and lifecycle requirements.

Areas requiring attention include:

- Isolating data between users and tenants
- Clearing or invalidating user-specific state on logout and account switching
- Handling legacy database versions and migrations
- Limiting storage growth for long conversations
- Avoiding stale cached content after a session changes

Do not replace the existing local persistence system wholesale without a demonstrated need and a migration plan.

## Shared Architecture

The repository contains shared feature modules, including `chat-core` and `ai-chat`.

Preserve their existing architectural boundaries when implementing new behavior. Prefer explicit ports and adapters over UI components depending directly on concrete infrastructure implementations.

Before adding a new abstraction, check whether an equivalent shared service or contract already exists.

## Development Setup

Install dependencies from the monorepo root:

```bash
pnpm install
```

Run the app using the workspace name and script defined in the current repository:

```bash
pnpm --filter <workspace-name> dev
```

Alternatively, inspect `apps/web-app/package.json` and run its defined development script from the application directory.

The application has been associated with development port `3000` in the current architecture inventory. Confirm the actual port configuration before relying on it.

## Environment Configuration

The application may require configuration for:

- Auth.js and OIDC
- AI chat API endpoints
- Chat history and feedback services
- MQTT broker connectivity
- Voice and audio services

Use the actual configuration code to identify the exact variable names. Do not copy secrets into source files, documentation, browser bundles, or logs.

Avoid introducing new `NEXT_PUBLIC_*` backend URLs for services that should be accessed through a trusted server-side boundary.

## Security Considerations

The architecture audit identified the following areas for remediation or verification:

- Some chat and history requests are initiated directly by the browser.
- Hardcoded or shared identity values must not be trusted as user identity.
- Browser-visible MQTT configuration and broker permissions require careful review.
- MQTT event payloads need runtime validation.
- Local data and service-worker caching require user isolation.
- Authentication refresh and error handling need reliable lifecycle management.
- Security headers and deployment protections need verification.

The severity of broker-related findings depends on the actual credentials and ACLs. Do not assume a broker vulnerability is confirmed without examining the broker configuration.

### Security Principles

- Never store privileged access tokens in local storage or IndexedDB.
- Never use a client-supplied user or tenant identifier as proof of identity.
- Validate incoming external payloads before updating application state.
- Keep Markdown rendering safe and avoid enabling raw HTML without a security review.
- Use backend-supported authorization and idempotency rather than relying on UI controls.
- Do not log access tokens, session secrets, private message content, or sensitive payloads.

## Testing and Quality

Run the type-check, lint, build, and test commands defined by the repository.

Recommended tests include:

- Authentication and logout behavior
- Chat request construction
- Realtime event validation and deduplication
- Listener cleanup
- Out-of-order and repeated event handling
- Network interruption and recovery
- Local database migrations
- Cross-user data isolation
- API authorization and error handling

The current automated test coverage should be verified before assuming these tests already exist.

## Related Documentation

- [`../../README.md`](../../README.md)
- [`../admin-app/README.md`](../admin-app/README.md)
- [`../ml-app/README.md`](../ml-app/README.md)
