/**
 * Double-submit-cookie CSRF protection for the admin API proxy.
 *
 * Deliberately isolated from `./server` (no NextAuth/env/crypto imports):
 * this module is imported from BOTH a server Route Handler and a
 * client-side RTK Query file. If it pulled in `../server`'s barrel (which
 * reads `AUTH_SECRET`, calls `next-auth/jwt`, etc.), that server-only code
 * would end up bundled into the browser. Keeping this to plain constants
 * and a pure function keeps it safe to import from either side.
 *
 * Flow:
 *  1. `server/proxy.ts` (edge middleware) sets a random, non-httpOnly
 *     `csrf_token` cookie once a session exists — non-httpOnly is
 *     required, the client must be able to read it.
 *  2. The client (`usersApi.ts`) reads that cookie and echoes it back as
 *     the `x-csrf-token` header on every mutation.
 *  3. The admin API proxy route (`route.ts`) rejects any state-changing
 *     request where the header doesn't exactly match the cookie — a
 *     cross-site request can trigger the browser to send the cookie
 *     automatically, but has no way to read it and repeat it in a header.
 */
export const CSRF_COOKIE_NAME = "csrf_token";
export const CSRF_HEADER_NAME = "x-csrf-token";

export function isCsrfValid(
  cookieValue: string | null | undefined,
  headerValue: string | null | undefined,
): boolean {
  return (
    Boolean(cookieValue) && Boolean(headerValue) && cookieValue === headerValue
  );
}

/**
 * Validate a state-changing browser request to the same-origin admin proxy.
 * Origin is required (not merely checked when present), and the double-submit
 * token must match. Safe methods are exempt because they must not mutate state.
 */
export function isCsrfRequestAllowed(input: {
  method: string;
  origin: string | null | undefined;
  requestOrigin: string;
  configuredOrigin: string;
  cookieValue: string | null | undefined;
  headerValue: string | null | undefined;
}): boolean {
  const method = input.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true;

  if (!input.origin) return false;

  const normalizeOrigin = (value: string): string | null => {
    try {
      const parsed = new URL(value);
      // Origin headers contain only scheme/host/port, never a path.
      if (parsed.origin !== value) return null;
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
        return null;
      return parsed.origin;
    } catch {
      return null;
    }
  };

  const origin = normalizeOrigin(input.origin);
  if (!origin) return false;

  const allowed = new Set(
    [input.requestOrigin, input.configuredOrigin]
      .map(normalizeOrigin)
      .filter((value): value is string => value !== null),
  );

  return (
    allowed.has(origin) && isCsrfValid(input.cookieValue, input.headerValue)
  );
}
