import { NextResponse } from "next/server";
import { auth } from "./auth";
import { createSsoProxyHandler } from "@super-app/features-auth/server";

const ssoProxy = auth(createSsoProxyHandler());

type ProxyContext = Parameters<typeof ssoProxy>[1];

const bypassUiAuth =
  process.env.NODE_ENV === "development" &&
  process.env.ADMIN_UI_AUTH_BYPASS === "true";

export default function proxy(
  request: Parameters<typeof ssoProxy>[0],
  ctx: ProxyContext,
) {
  if (bypassUiAuth) {
    return NextResponse.next();
  }

  return ssoProxy(request, ctx);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
