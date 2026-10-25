const issuer = () => (process.env.OIDC_ISSUER ?? "").replace(/\/$/, "");
const clientId = () => process.env.OIDC_CLIENT_ID ?? "";
const clientSecret = () => process.env.OIDC_CLIENT_SECRET ?? "";

/** OpenIddict compares post_logout_redirect_uri exactly — keep a trailing slash. */
export function normalizePostLogoutRedirectUri(uri?: string | null): string {
  const fallback = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000/";
  const raw = (uri ?? fallback).trim();
  if (!raw) {
    return "http://localhost:3000/";
  }
  return raw.endsWith("/") ? raw : `${raw}/`;
}

/**
 * Builds the OpenIddict `/connect/logout` (end-session) URL. Visiting this
 * URL clears the IdP's own SSO cookie session, in addition to whatever the
 * app does to clear its local NextAuth session.
 */
export function buildEndSessionUrl(options?: {
  postLogoutRedirectUri?: string;
  idTokenHint?: string | null;
}): string {
  const url = new URL(`${issuer()}/connect/logout`);
  url.searchParams.set(
    "post_logout_redirect_uri",
    normalizePostLogoutRedirectUri(options?.postLogoutRedirectUri),
  );
  url.searchParams.set("client_id", clientId());
  if (options?.idTokenHint) {
    url.searchParams.set("id_token_hint", options.idTokenHint);
  }
  return url.toString();
}

/**
 * RFC 7009 token revocation against the IdP `/connect/revocation` endpoint.
 */
export async function revokeOidcToken(
  token: string,
  tokenTypeHint: "access_token" | "refresh_token",
): Promise<{ ok: boolean; status: number; detail?: string }> {
  if (!token.trim()) {
    return { ok: false, status: 0, detail: "empty token" };
  }

  const body = new URLSearchParams({
    token,
    token_type_hint: tokenTypeHint,
    client_id: clientId(),
    client_secret: clientSecret(),
  });

  try {
    const response = await fetch(`${issuer()}/connect/revocation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });
    const detail = response.ok
      ? undefined
      : await response.text().catch(() => undefined);
    return { ok: response.ok, status: response.status, detail };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      detail: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function revokeAccessAndRefreshTokens(options: {
  accessToken?: string | null;
  refreshToken?: string | null;
}): Promise<{ revoked: number; errors: string[] }> {
  const errors: string[] = [];
  let revoked = 0;

  if (options.accessToken) {
    const result = await revokeOidcToken(options.accessToken, "access_token");
    if (result.ok) {
      revoked += 1;
    } else {
      errors.push(
        `access_token: ${result.status} ${result.detail ?? ""}`.trim(),
      );
    }
  }

  if (options.refreshToken) {
    const result = await revokeOidcToken(options.refreshToken, "refresh_token");
    if (result.ok) {
      revoked += 1;
    } else {
      errors.push(
        `refresh_token: ${result.status} ${result.detail ?? ""}`.trim(),
      );
    }
  }

  if (!options.accessToken && !options.refreshToken) {
    errors.push("no tokens in session — sign in again after updating the app");
  }

  return { revoked, errors };
}

export type RefreshedTokens = {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresIn: number;
  expiresAt: number; // unix seconds
};

export async function refreshOidcTokens(
  refreshToken: string,
): Promise<
  | { ok: true; tokens: RefreshedTokens }
  | { ok: false; detail: string; status?: number }
> {
  if (!refreshToken?.trim()) {
    return { ok: false, detail: "refresh_token خالی است" };
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId(),
    client_secret: clientSecret(),
  });

  try {
    const response = await fetch(`${issuer()}/connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        detail: text || `HTTP ${response.status}`,
      };
    }

    const data = JSON.parse(text) as {
      access_token?: string;
      refresh_token?: string;
      id_token?: string;
      expires_in?: number;
    };

    if (!data.access_token) {
      return { ok: false, detail: "پاسخ IdP فاقد access_token است" };
    }

    const expiresIn =
      typeof data.expires_in === "number" ? data.expires_in : 3600;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    return {
      ok: true,
      tokens: {
        accessToken: data.access_token,
        // OpenIddict معمولاً refresh_token جدید می‌دهد؛ اگر نداد همان قبلی را نگه می‌داریم
        refreshToken: data.refresh_token ?? refreshToken,
        idToken: data.id_token,
        expiresIn,
        expiresAt,
      },
    };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "خطای شبکه در refresh",
    };
  }
}
