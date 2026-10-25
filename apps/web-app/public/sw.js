/* eslint-env serviceworker */

const CACHE_NAME = "super-app-shell-v1";
const CHAT_SHELL_PATHS = ["/", "/chat"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CHAT_SHELL_PATHS))
      .catch(() => undefined),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key !== CACHE_NAME && key.startsWith("super-app-shell-"),
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // فقط درخواست‌های همین سایت را مدیریت کن.
  if (url.origin !== self.location.origin) {
    return;
  }

  // API و backend را cache نکن.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/tts-backend/") ||
    url.pathname.startsWith("/backend/") ||
    url.pathname.startsWith("/mqtt/") ||
    url.pathname.startsWith("/_next/image")
  ) {
    return;
  }

  // Navigation:
  // آنلاین از شبکه بگیر و cache کن.
  // آفلاین از cache استفاده کن.
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Static assets:
  // اول cache، بعد network.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirstStatic(request));
  }
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    // ابتدا دقیقاً همان URL را از cache امتحان کن.
    const exact = await cache.match(request);

    if (exact) {
      return exact;
    }

    // سپس chat shell.
    const chatShell = await cache.match("/chat");

    if (chatShell) {
      return chatShell;
    }

    // سپس root.
    const root = await cache.match("/");

    if (root) {
      return root;
    }

    return new Response(
      `
        <!doctype html>
        <html lang="fa" dir="rtl">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>بانک کشاورزی</title>
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: grid;
                place-items: center;
                font-family: sans-serif;
              }
            </style>
          </head>
          <body>
            اتصال به اینترنت برقرار نیست.
          </body>
        </html>
      `,
      {
        status: 503,
        statusText: "Offline",
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  }
}

async function cacheFirstStatic(request) {
  const cache = await caches.open(CACHE_NAME);

  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return new Response("Offline", {
      status: 503,
      statusText: "Offline",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
