import NextAuth, {
  type NextAuthConfig,
  type Session,
  type User,
} from "next-auth";
import { getToken } from "next-auth/jwt";
import {
  mapOidcProfile,
  oidcProfileSchema,
  parseEmailVerified,
  parsePhoneVerified,
  parseRoles,
} from "./oidc-profile";
import { refreshOidcTokens } from "./oidc-tokens";
import "next-auth/jwt";

export type AppSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
  phoneNumberVerified: boolean;
  preferredUsername?: string | null;
  roles: string[];
  tenantId?: string | null;
  tenantSlug?: string | null;
  tenantName?: string | null;
};

type AppUser = User & {
  emailVerified?: boolean;
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
  preferredUsername?: string | null;
  roles?: string[];
  tenantId?: string | null;
  tenantSlug?: string | null;
  tenantName?: string | null;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is missing from the app environment.`);
  }
  return value;
}

/**
 * Creates a NextAuth (Auth.js v5) instance configured against the backend's
 * OpenIddict OIDC server.
 *
 * This mirrors, field for field, the working reference implementation in
 * `ssosample` (`src/auth.ts`): same provider id ("openiddict"), same
 * authorization-code + PKCE + state + nonce flow (handled internally by
 * Auth.js), same scopes, and the same JWT/session shape. Each Next.js app in
 * the monorepo calls this factory with its own environment variables so that
 * every app gets its own signed session cookie, while the OIDC logic itself
 * lives in exactly one place.
 */
export function createSsoAuth() {
  const oidcIssuer = requiredEnv("OIDC_ISSUER");
  const oidcClientId = requiredEnv("OIDC_CLIENT_ID");
  const oidcClientSecret = requiredEnv("OIDC_CLIENT_SECRET");
  requiredEnv("AUTH_SECRET");

  // Node rejects the ASP.NET dev HTTPS cert when fetching OIDC discovery.
  // Prefer `dotnet dev-certs https --trust`; this fallback is for local HTTPS only.
  if (
    process.env.NODE_ENV === "development" &&
    oidcIssuer.startsWith("https://localhost")
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const authConfig = {
    providers: [
      {
        id: "openiddict",
        name: "SSO",
        type: "oidc",
        issuer: oidcIssuer,
        clientId: oidcClientId,
        clientSecret: oidcClientSecret,
        // Auth.js performs PKCE (S256), state and nonce automatically for
        // this provider — identical to what `ssosample` relies on. There is
        // no need for a hand-rolled PKCE/state implementation anywhere else
        // in the app.
        checks: ["pkce", "state", "nonce"],
        authorization: {
          params: {
            // `offline_access` is required for OpenIddict to issue a
            // refresh_token; without it `account.refresh_token` below is
            // always undefined. Matches ssosample's scope list exactly.
            scope: "openid profile email phone roles offline_access sso.admin",
          },
        },
        profile(profile) {
          const parsed = oidcProfileSchema.parse(profile);
          return mapOidcProfile(parsed);
        },
      },
    ],
    pages: {
      signIn: "/login",
      error: "/error",
    },
    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 8,
    },
    trustHost: true,
    callbacks: {
      async jwt({ token, account, profile, user }) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.idToken = account.id_token;
          token.expiresAt =
            typeof account.expires_at === "number"
              ? account.expires_at
              : Math.floor(Date.now() / 1000) + (account.expires_in ?? 3600);
        }

        if (user) {
          const appUser = user as AppUser;
          token.sub = appUser.id;
          token.name = appUser.name;
          token.email = appUser.email;
          token.emailVerified = appUser.emailVerified ?? false;
          token.phoneNumber = appUser.phoneNumber ?? null;
          token.phoneNumberVerified = appUser.phoneNumberVerified ?? false;
          token.preferredUsername = appUser.preferredUsername ?? null;
          token.roles = appUser.roles ?? [];
          token.tenantId = appUser.tenantId ?? null;
          token.tenantSlug = appUser.tenantSlug ?? null;
          token.tenantName = appUser.tenantName ?? null;
        }

        if (profile && typeof profile === "object" && "sub" in profile) {
          const parsed = oidcProfileSchema.safeParse(profile);
          if (parsed.success) {
            const mapped = mapOidcProfile(parsed.data);
            token.sub = mapped.id;
            token.name = mapped.name;
            token.email = mapped.email;
            token.emailVerified = mapped.emailVerified;
            token.phoneNumber = mapped.phoneNumber;
            token.phoneNumberVerified = mapped.phoneNumberVerified;
            token.preferredUsername = mapped.preferredUsername;
            token.roles = mapped.roles;
            token.tenantId = mapped.tenantId;
            token.tenantSlug = mapped.tenantSlug;
            token.tenantName = mapped.tenantName;
          }
        }

        const expiresAt =
          typeof token.expiresAt === "number" ? token.expiresAt : 0;
        const now = Math.floor(Date.now() / 1000);
        if (expiresAt > now + 60) {
          return token;
        }

        if (!token.refreshToken || typeof token.refreshToken !== "string") {
          return { ...token, error: "RefreshTokenMissing" };
        }

        const result = await refreshOidcTokens(token.refreshToken);
        if (!result.ok) {
          return { ...token, error: "RefreshAccessTokenError" };
        }

        return {
          ...token,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          idToken: result.tokens.idToken ?? token.idToken,
          expiresAt: result.tokens.expiresAt,
          error: undefined,
        };
      },
      async session({
        session,
        token,
      }): Promise<Session & { user: AppSessionUser }> {
        return {
          ...session,

          error: typeof token.error === "string" ? token.error : undefined,
          user: {
            id: typeof token.sub === "string" ? token.sub : "",
            name: typeof token.name === "string" ? token.name : null,
            email: typeof token.email === "string" ? token.email : null,
            emailVerified: parseEmailVerified(token.emailVerified),
            phoneNumber:
              typeof token.phoneNumber === "string" ? token.phoneNumber : null,
            phoneNumberVerified: parsePhoneVerified(token.phoneNumberVerified),
            preferredUsername:
              typeof token.preferredUsername === "string"
                ? token.preferredUsername
                : null,
            roles: parseRoles(token.roles),
            tenantId:
              typeof token.tenantId === "string" ? token.tenantId : null,
            tenantSlug:
              typeof token.tenantSlug === "string" ? token.tenantSlug : null,
            tenantName:
              typeof token.tenantName === "string" ? token.tenantName : null,
          },
        };
      },
    },
  } satisfies NextAuthConfig;

  return NextAuth(authConfig);
}

export type ServerAuthToken = {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  error?: string;
};

export async function getServerAuthToken(request?: {
  headers: Headers;
  cookies: { getAll(): { name: string; value: string }[] };
}): Promise<ServerAuthToken | null> {
  let req = request;

  if (!req) {
    const { cookies, headers } = await import("next/headers");
    const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
    req = { headers: headerList, cookies: cookieStore };
  }

  try {
    const token = await getToken({
      req: {
        headers: Object.fromEntries(req.headers.entries()),
        cookies: Object.fromEntries(
          req.cookies.getAll().map((c) => [c.name, c.value]),
        ),
      } as Parameters<typeof getToken>[0]["req"],
      secret: process.env.AUTH_SECRET,
    });
    if (!token) return null;

    return {
      accessToken:
        typeof token.accessToken === "string" ? token.accessToken : undefined,
      refreshToken:
        typeof token.refreshToken === "string" ? token.refreshToken : undefined,
      idToken: typeof token.idToken === "string" ? token.idToken : undefined,
      expiresAt:
        typeof token.expiresAt === "number" ? token.expiresAt : undefined,
      error: typeof token.error === "string" ? token.error : undefined,
    };
  } catch {
    return null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    error?: string;
    emailVerified?: boolean;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean;
    preferredUsername?: string | null;
    roles?: string[];
    tenantId?: string | null;
    tenantSlug?: string | null;
    tenantName?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: AppSessionUser;
    error?: string;
  }
}
