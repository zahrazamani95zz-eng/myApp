import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sanitizeReturnUrl } from "./return-url";
import { CSRF_COOKIE_NAME } from "../csrf";

const STATIC_FILE = /\.(.*)$/;

export interface SsoProxyOptions {
  /** Route prefixes that should stay reachable without a session. */
  publicRoutes?: string[];
  /** Path of the app's local login route. Defaults to "/login". */
  signInPath?: string;
}

type AuthedRequest = NextRequest & { auth: unknown };

// /**
//  * Returns the plain middleware callback — deliberately NOT wrapped in
//  * `auth(...)` here. Each app wraps it with its own `auth` instance:
//  *
//  *   // apps/*/proxy.ts
//  *   export default auth(createSsoProxyHandler());
//  *
//  * Wrapping with `auth(...)` inside this factory would bake Auth.js's
//  * internal (non-exported) middleware-handler type into this package's
//  * emitted `.d.ts`, which `tsc -b` rejects (TS2883: "cannot be named
//  * without a reference to 'AppRouteHandlerFn'"). Returning a plain,
//  * fully-nameable function type avoids that, while the redirect rule
//  * itself still lives in exactly one place.
//  *
//  * Redirects unauthenticated visitors to the app's login route
//  * (`signInPath`, with `?callbackUrl=` set to where they were headed).
//  * The login route itself (see each app's `login/route.ts`) immediately
//  * calls `signIn()` with no button/click required, so in practice this
//  * sends the browser straight into the SSO flow the moment the app loads
//  * with no session — matching ssosample's behavior.
//  *
//  * Also issues the CSRF cookie (double-submit pattern — see `../csrf`) the
//  * first time an authenticated request comes through, so it's already in
//  * place by the time any page can render a button that triggers a mutation.
//  */
export function createSsoProxyHandler(options: SsoProxyOptions = {}) {
  const publicRoutes = options.publicRoutes ?? ["/login", "/error"];
  const signInPath = options.signInPath ?? "/login";

  return (request: AuthedRequest): NextResponse => {
    const { pathname } = request.nextUrl;

    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/fonts") ||
      pathname === "/favicon.ico" ||
      STATIC_FILE.test(pathname)
    ) {
      return NextResponse.next();
    }

    const isPublic = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (!request.auth && !isPublic) {
      const loginUrl = new URL(signInPath, request.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", sanitizeReturnUrl(pathname));
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();

    if (request.auth && !request.cookies.get(CSRF_COOKIE_NAME)) {
      // Never mark Secure on plain HTTP (LAN / IP hosts); browsers drop the cookie
      // and mutating /api/admin calls then fail CSRF double-submit checks.
      const secure =
        request.nextUrl.protocol === "https:" ||
        request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ===
          "https";
      response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), {
        httpOnly: false,
        sameSite: "lax",
        secure,
        path: "/",
      });
    }

    return response;
  };
}
