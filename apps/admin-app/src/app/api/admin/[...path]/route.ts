import { NextResponse, type NextRequest } from "next/server";
import { unstable_update } from "@/auth";
import { serverEnv } from "@/config/env";
import {
  getServerAuthToken,
  refreshOidcTokens,
} from "@super-app/features-auth/server";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  isCsrfRequestAllowed,
} from "@super-app/features-auth/csrf";

const ADMIN_API_BASE_URL = serverEnv.ADMIN_API_BASE_URL.replace(/\/$/, "");
const CONFIGURED_APP_ORIGIN = new URL(serverEnv.NEXT_PUBLIC_APP_URL).origin;

function buildTargetUrl(request: NextRequest, path: string[]): URL {
  const encodedPath = path
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = new URL(`${ADMIN_API_BASE_URL}/api/admin/${encodedPath}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });
  return url;
}

async function callBackend(
  request: NextRequest,
  path: string[],
  accessToken: string,
  bodyText: string | undefined,
): Promise<Response> {
  const hasBody = bodyText !== undefined;
  return fetch(buildTargetUrl(request, path), {
    method: request.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: bodyText,
    cache: "no-store",
  });
}

async function toNextResponse(
  backendResponse: Response,
): Promise<NextResponse> {
  const responseText = await backendResponse.text();
  return new NextResponse(responseText.length ? responseText : null, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("Content-Type") ?? "application/json",
    },
  });
}

async function proxy(request: NextRequest, path: string[]): Promise<Response> {
  if (
    path.some(
      (segment) =>
        segment === "." ||
        segment === ".." ||
        segment.includes("/") ||
        segment.includes("\\") ||
        segment.includes("://") ||
        segment.includes("?") ||
        segment.includes("#"),
    )
  ) {
    return NextResponse.json(
      { message: "مسیر درخواست نامعتبر است." },
      { status: 400 },
    );
  }

  const csrfAllowed = isCsrfRequestAllowed({
    method: request.method,
    origin: request.headers.get("origin"),
    requestOrigin: request.nextUrl.origin,
    configuredOrigin: CONFIGURED_APP_ORIGIN,
    cookieValue: request.cookies.get(CSRF_COOKIE_NAME)?.value,
    headerValue: request.headers.get(CSRF_HEADER_NAME),
  });
  if (!csrfAllowed) {
    return NextResponse.json(
      { message: "درخواست نامعتبر است." },
      { status: 403 },
    );
  }

  const token = await getServerAuthToken(request);

  if (!token?.accessToken) {
    return NextResponse.json(
      { message: "احراز هویت نشده است." },
      { status: 401 },
    );
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const bodyText = hasBody ? await request.text() : undefined;

  let backendResponse = await callBackend(
    request,
    path,
    token.accessToken,
    bodyText,
  );

  if (backendResponse.status === 401 && token.refreshToken) {
    const refreshed = await refreshOidcTokens(token.refreshToken);

    if (refreshed.ok && refreshed.tokens) {
      const { tokens } = refreshed;

      await unstable_update({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
        expiresAt: tokens.expiresAt,
      } as Parameters<typeof unstable_update>[0]);

      backendResponse = await callBackend(
        request,
        path,
        tokens.accessToken,
        bodyText,
      );
    }
  }

  return toNextResponse(backendResponse);
}

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxy(request, path);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxy(request, path);
}
