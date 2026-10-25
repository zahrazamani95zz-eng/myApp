import type { NextRequest } from "next/server";
import { signIn } from "@/auth";
import { sanitizeReturnUrl } from "@super-app/features-auth/server";

/**
 * A Route Handler, not a page — on purpose. `signIn()` needs to set the
 * PKCE/state/nonce cookies before redirecting to the IdP, and Next.js only
 * allows cookie mutation inside a Server Action or a Route Handler (a
 * plain Server Component render is read-only for cookies and throws:
 * "Cookies can only be modified in a Server Action or Route Handler").
 * A GET Route Handler gives us that write-access while still being a
 * normal full-page navigation for the browser — no click required, no
 * client JS involved.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const callbackUrl = sanitizeReturnUrl(
    request.nextUrl.searchParams.get("callbackUrl"),
  );

  await signIn("openiddict", { redirectTo: callbackUrl });

  // signIn() above always redirects (it throws Next's internal redirect
  // signal on the success path), so this line is unreachable at runtime.
  // It only exists so the Route Handler's static return type is Response.
  return new Response(null, { status: 302 });
}
