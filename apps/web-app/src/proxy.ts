import { auth } from "./auth";
import { createSsoProxyHandler } from "@super-app/features-auth/server";

export default auth(createSsoProxyHandler());

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
