---
name: backend-api-review
description: Review backend code and any code that makes or serves API calls for security, authentication and authorization, input validation, error handling, readability, code organization, and integration with the full-stack application. Use when asked to review, audit, or assess API routes, serverless functions, server logic, database access, third-party API clients, data-fetching code in the frontend, or authentication flows.
---

# Backend and API Code Review

## Purpose

Perform a structured review of backend code and of any code, on the server or in the browser, that makes or serves API calls. Identify concrete security, correctness, reliability, and maintainability issues and recommend fixes that fit the existing project architecture.

Prioritize issues that expose secrets or user data, allow unauthorized access, corrupt data, break the integration between frontend and backend, or create significant maintenance problems.

The review should be evidence-based. Do not invent problems, recommend unnecessary rewrites, or present personal style preferences as defects.

Reference standards, to be applied where relevant rather than recited:

- OWASP API Security Top 10 (2023).
- OWASP Top 10 (2021).
- OWASP Application Security Verification Standard (ASVS) and the OWASP Cheat Sheet Series.
- The terms of use and documentation of any third-party API the project calls.

## Initial Inspection

Before reviewing code:

1. Inspect the project structure and relevant project instructions, including README files, CLAUDE.md, `docs/`, and other applicable agent instructions.
2. Identify where backend logic actually runs. Possible locations include a separate server (Express, Fastify, Hono), serverless or edge functions (for example `api/` on Vercel), framework route handlers (Next.js Route Handlers, Server Actions), or no backend at all with the browser calling APIs directly.
3. Identify the runtime, framework versions, module system, and build tool. In a Vite project, remember that every `VITE_`-prefixed environment variable is embedded in the client bundle and is public.
4. Map every outbound API call: which code makes it, from which environment (browser, server, build time), with which credentials, and what happens to the response.
5. Map every inbound endpoint: its route, method, expected input, authentication requirement, and the data it returns or changes.
6. Identify the data layer, if any: database, ORM (such as Prisma), schema, migrations, and connection handling.
7. Identify the authentication and session mechanism, if any, and the roles or ownership rules it is meant to enforce.
8. Inspect environment variable usage, `.env*` files, `.gitignore`, deployment configuration (for example `vercel.json`), and CI configuration.
9. Inspect available tests, linting, type checking, and package scripts.
10. Distinguish features that are implemented from those that use mock data or are only planned. Do not review planned features as if they existed, but flag design decisions in current code that would make the planned features insecure.

Do not modify files during the review unless explicitly asked to implement fixes.

## Review Procedure

### 1. Secrets and Configuration

- Check that API keys, tokens, database URLs, and signing secrets are never hardcoded in source, committed in `.env` files, or printed in logs.
- Check that `.env`, `.env.local`, and similar files are listed in `.gitignore`, and that a `.env.example` with placeholder values documents the required variables.
- Check that secrets are not exposed to the browser. In Vite, any `VITE_` variable and anything imported into client code is public. In Next.js, the same applies to `NEXT_PUBLIC_` variables.
- If a third-party API key must stay private, check that calls go through a server-side proxy or function instead of the browser. If the provider designs a key to be used client-side, note this and check that it is restricted (domain or referrer limits, read-only scope).
- Check whether secrets have already been committed to git history. If so, recommend rotating them, since removing them from the current files is not enough.
- Check that configuration is validated at startup, so a missing variable fails clearly instead of producing confusing runtime errors.
- Check that development-only settings (debug output, permissive CORS, verbose errors, test credentials) cannot reach production.

### 2. Authentication

Review only the mechanisms the project actually uses or is about to introduce.

- Prefer an established provider or library (for example Auth.js, Better Auth, Clerk, Lucia-style session patterns) over custom authentication code. Flag hand-rolled cryptography or token formats.
- Passwords: check that they are hashed with Argon2id, scrypt, or bcrypt with an appropriate cost, and are never stored, logged, or returned in plaintext or with fast hashes such as MD5 or SHA-256.
- Sessions: prefer server-side sessions or short-lived tokens in cookies marked `HttpOnly`, `Secure`, and `SameSite=Lax` or `Strict`. Flag access tokens or session IDs stored in `localStorage` or `sessionStorage`, where any XSS can steal them.
- JWTs, if used: check signature verification with an explicit algorithm allow-list, the rejection of `alg: none`, validation of `exp`, `iss`, and `aud`, short lifetimes, and a refresh and revocation strategy. Check that no sensitive data is stored in the payload, which is only encoded, not encrypted.
- OAuth and OpenID Connect: check use of the Authorization Code flow with PKCE, validation of `state` (and `nonce` where applicable), and exact redirect URI matching.
- Check that session IDs are regenerated on login and privilege change, and that logout invalidates the session on the server, not only in the client.
- Check login, registration, and password reset for rate limiting, uniform error messages that do not reveal whether an account exists, single-use expiring reset tokens, and protection against brute force.
- Check that cookie-based authentication is protected against CSRF, through `SameSite` cookies, CSRF tokens, or origin checks, for every state-changing request.

### 3. Authorization and Access Control

- Check that every endpoint that reads or changes non-public data enforces authorization on the server. Hiding a button in the UI is not access control.
- Check object-level authorization: a user who requests `/api/favorites/123` must own favorite 123 (OWASP API1, Broken Object Level Authorization).
- Check function-level authorization for administrative or privileged actions (OWASP API5).
- Check property-level authorization: responses should not include fields the user may not see, and updates should not accept fields the user may not set, such as `role`, `userId`, or `isAdmin` (mass assignment, OWASP API3).
- Check that the user identity comes from the verified session or token, never from a request body, query parameter, or header the client controls.
- Prefer deny-by-default: routes should require authentication unless they are explicitly public.

### 4. Input Validation and Injection

- Check that every input crossing a trust boundary (body, query, route params, headers, cookies, webhook payloads, and third-party API responses) is validated on the server for type, format, length, and allowed values. Schema libraries such as Zod or Valibot are a good fit. Client-side validation is for usability only.
- Prefer allow-lists and explicit parsing over block-lists and ad-hoc checks.
- SQL and ORM: check for string-concatenated queries. With Prisma, flag `$queryRawUnsafe` and `$executeRawUnsafe` with user input, and prefer the tagged-template `$queryRaw` or the query API.
- Check for NoSQL operator injection, command injection (`exec`, `spawn` with shell), path traversal in file access, and unsafe deserialization.
- SSRF: if the server fetches a URL or path influenced by user input, check that the host is fixed or allow-listed and that user input is encoded into a path or query rather than concatenated into the base URL (OWASP API7).
- Check that user input placed into outbound API URLs is encoded with `encodeURIComponent` or `URLSearchParams`.
- Check that data returned from APIs and later rendered as HTML is not passed to `dangerouslySetInnerHTML` or similar without sanitization.

### 5. Outbound API Integration (Third-Party Clients)

Apply this section to any code that calls an external API, such as TMDB.

- Check that API calls are centralized in a dedicated client or service module rather than scattered `fetch` calls in components, with one place for the base URL, authentication, headers, and error handling.
- Check that `response.ok` (or the status code) is checked before the body is parsed. `fetch` does not reject on HTTP errors.
- Check for timeouts and cancellation (`AbortController`, `AbortSignal.timeout`), including cancellation of stale requests when a search term or component changes.
- Check for race conditions in which an older response overwrites a newer one, such as search-as-you-type.
- Check retry behavior: only for idempotent requests and transient errors, with exponential backoff and a limit, and respecting `Retry-After` on 429 responses.
- Check that provider rate limits are respected through debouncing, caching, and request de-duplication.
- Check caching: suitable HTTP or in-memory caching for data that changes rarely (for example configuration, genres, and movie details), with a clear expiry.
- Check that responses are validated or narrowed before use, and that missing or null fields (posters, release dates, overviews) are handled without crashes.
- Check that provider data is mapped to the application's own shape at the boundary, so that UI components do not depend on the raw third-party response format.
- Check pagination handling, and that requests are not made in avoidable sequential waterfalls.
- Check compliance with the provider's terms, such as required attribution, image usage rules, and caching limits.
- Check that user-facing errors are friendly and do not leak keys, internal URLs, or raw provider error bodies.

### 6. Inbound API Design (Endpoints the Project Exposes)

- Check that HTTP methods match their semantics: `GET` is safe and has no side effects, `PUT` and `DELETE` are idempotent, and state changes do not happen through `GET`.
- Check that status codes are accurate and consistent (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500), especially the difference between 401 (not authenticated) and 403 (not allowed).
- Check for one consistent error response shape across endpoints, so that the frontend can handle errors in one place.
- Check that resource and route naming is consistent and predictable.
- Check that list endpoints are paginated and that request sizes, page sizes, and payload sizes are limited (OWASP API4, Unrestricted Resource Consumption).
- Check that only the fields the client needs are returned. Do not serialize whole database records.
- Check for rate limiting on expensive, public, or authentication-related endpoints.
- Check that CORS is restricted to known origins, that wildcard origins are never combined with credentials, and that CORS is not treated as an authorization mechanism.
- Check for appropriate security headers where the backend serves responses directly (for example `Content-Type`, `Cache-Control: no-store` on sensitive responses, and `X-Content-Type-Options`).
- Check webhook endpoints for signature verification and replay protection.

### 7. Error Handling, Logging, and Observability

- Check that errors are caught at clear boundaries, and that unexpected errors return a generic 500 response while the details are logged on the server.
- Check that stack traces, SQL errors, file paths, and provider error bodies are never sent to the client in production.
- Check for swallowed errors (empty `catch` blocks, ignored promise rejections, `console.log` instead of handling).
- Check that logs are useful (route, status, duration, request ID) but exclude secrets, tokens, passwords, and unnecessary personal data.
- Check that security-relevant events, such as failed logins and authorization failures, are logged where the project has a backend.

### 8. Data Layer

Apply this section only if the project uses a database.

- Check that the schema enforces integrity through constraints, unique indexes, foreign keys, and non-null fields, rather than relying only on application code.
- Check that indexes support the queries actually run, and look for N+1 query patterns.
- Check that multi-step changes that must succeed or fail together use transactions.
- Check that migrations are versioned, committed, and applied through a repeatable workflow, never by editing production schemas by hand.
- Check that database clients are reused correctly. In serverless environments, check for connection exhaustion and the use of pooling or an appropriate driver adapter.
- Check that the database user has least-privilege access and that connection strings are kept server-side.
- Check whether personal data is minimized and whether sensitive fields need encryption or particular handling.

### 9. Code Readability and Organization

- Check for a clear separation of layers: route or handler (HTTP concerns), service (business logic), and data access or API client (I/O). Business rules should not live inside UI components or be duplicated across handlers.
- Check that functions are small, have one responsibility, and use descriptive names, and that names follow the project's existing conventions.
- Check for duplicated request logic, magic strings and numbers (URLs, page sizes, cache durations), and copy-pasted error handling that should be shared.
- Check that `async` code is consistent (`async`/`await` rather than mixed callbacks and promise chains) and that no promise is left floating without handling.
- Check that shared request and response shapes are defined once (types, JSDoc, or schemas) and reused by both the frontend and the backend where possible.
- Check that comments explain intent and non-obvious decisions rather than restating the code.
- Check for dead code, leftover mock data mixed with real data, and outdated TODOs.
- Respect the project's existing structure. Recommend reorganization only when the current structure causes a concrete problem.

### 10. Full-Stack Integration

- Check that the frontend and backend agree on the API contract (paths, methods, parameters, response shapes, and error shapes), and that changes on one side are reflected on the other.
- Check that the frontend handles every response state it can receive: loading, success, empty, validation error, 401, 403, 404, 429, 5xx, timeout, and offline.
- Check that the frontend does not treat its own state as authoritative for data the server owns, and that it revalidates or rolls back optimistic updates when a request fails.
- Check that the frontend uses one configured API base (relative paths or a single environment variable) instead of hardcoded hosts that break across development, preview, and production.
- Check that the local development setup (for example a Vite dev proxy or `vercel dev`) mirrors production routing closely enough to catch integration errors.
- Check that environment variables are defined for every deployment environment that needs them, without production secrets in preview or development.
- Check that the migration from mock data to real API data keeps the same data shape, or that the change is handled deliberately.

### 11. Dependencies and Supply Chain

- Check for known vulnerabilities with `npm audit` or the equivalent, when it is allowed and practical, and judge whether each one is actually reachable.
- Check that the lockfile is committed and that dependencies come from trusted, maintained packages.
- Flag dependencies added for trivial functionality that the platform already provides (for example `fetch`, `URL`, `crypto.randomUUID`).
- Check that server-only packages are not bundled into client code.

### 12. Testing and Verification

- Identify existing unit, integration, and end-to-end tests for API clients, handlers, and authentication flows.
- Check whether important paths are tested: authorization failures, invalid input, provider errors, timeouts, and empty results, as well as the successful case.
- Check that tests mock external APIs at the network boundary instead of calling real services with real keys.
- Run existing tests, linting, type checking, or builds when permitted and practical.
- Do not call real third-party APIs, use real credentials, or change remote services or data as part of a review unless explicitly authorized.

Never claim that tests, builds, scans, or runtime checks passed unless they were actually executed and the results were observed.

## Severity Classification

Assign each finding a severity based on its actual impact and likelihood.

- **Critical:** An immediately exploitable issue, such as an exposed secret with meaningful privileges, an authentication bypass, an injection, or access to other users' data, or a defect that breaks a core flow for all users.
- **High:** A significant security weakness or defect that is likely to be exploited or encountered, such as missing authorization on a sensitive endpoint, tokens in `localStorage` alongside an XSS risk, or unhandled API failures that break a main page.
- **Medium:** A meaningful issue with a more limited impact or requiring specific conditions, such as missing rate limiting, missing timeouts, inconsistent error handling, or leaking internal error details.
- **Low:** A minor defect, readability problem, or hardening opportunity with limited impact.
- **Informational:** An observation, trade-off, or optional improvement that is not necessarily a defect.

Do not inflate severity. A public, read-only, domain-restricted API key is not equivalent to a database password. Consider exploitability, the data at risk, the number of affected users, and existing mitigations.

## Working Rules

- Begin with a review. Do not modify files unless explicitly asked to implement fixes.
- Inspect and trace the actual implementation before making claims about defects. Follow a request from the UI, through any client or proxy, to the handler and data layer.
- Follow the existing project architecture and instructions.
- Distinguish confirmed vulnerabilities and defects, likely risks, and optional improvements.
- Support findings with concrete evidence: file paths, line numbers, and code or observed behavior.
- Do not print secret values found during the review. Refer to them by variable name and location only.
- Do not attempt exploitation against deployed or third-party systems. Demonstrate issues through code analysis, or through local tests when authorized.
- Avoid reporting the same underlying problem multiple times under different categories.
- Prefer the smallest change that adequately addresses each problem. Do not recommend new frameworks, services, or abstraction layers without a concrete need.
- When information is insufficient, state the uncertainty and explain what additional inspection would resolve it.
- Prioritize actionable recommendations over generic best-practice statements.

## Output Format

Structure the review as follows.

### 1. Review Scope

Summarize the endpoints, API clients, authentication flows, data access code, and configuration inspected.

State any limitations, including whether the review was static only or included tests, builds, dependency scans, or runtime checks.

### 2. Architecture Overview

Briefly describe how data flows between the browser, any backend or functions, external APIs, and the database, and where trust boundaries and secrets sit. Keep it to what is needed to understand the findings.

### 3. Executive Summary

Summarize the overall condition of the backend and API integration, the most important risks, and the recommended priorities.

Avoid declaring the application secure based on a limited review.

### 4. Findings

Order findings by severity, from Critical to Informational.

For each finding, provide:

- **Title:** A concise description of the issue.
- **Severity:** Critical, High, Medium, Low, or Informational.
- **Category:** Secrets, Authentication, Authorization, Input Validation, Outbound API, API Design, Error Handling, Data Layer, Readability, Integration, Dependencies, or Testing.
- **Reference:** The relevant OWASP item or standard, where one applies.
- **Location:** Relevant file paths and line numbers.
- **Evidence:** The actual code or observed behavior supporting the finding, with secrets redacted.
- **Impact:** What an attacker could do, or how users, data, or maintainability are affected.
- **Recommendation:** A specific, proportionate remediation, with a short code example when it helps.
- **Verification:** How to confirm that the issue has been resolved.

Do not include a finding merely to populate a category. If no significant issue is identified in an area, say so when relevant to the review scope.

### 5. Missing Tests and Verification

List important tests, scans, or runtime checks that should be performed but were not completed, and explain the reason for each.

### 6. Prioritized Action Plan

Provide a concise, ordered list of recommended actions.

Prioritize exposed secrets (rotate first), authentication and authorization flaws, injection, and data-integrity risks before reliability, readability, and optional improvements.

Separate necessary corrections from optional enhancements.

### 7. Overall Assessment

Summarize the principal strengths, remaining risks, and limitations of the review.

Clearly distinguish verified results from assumptions and recommendations.

Do not claim that the backend or API integration is secure, reliable, or production-ready unless the scope and evidence justify that conclusion.
