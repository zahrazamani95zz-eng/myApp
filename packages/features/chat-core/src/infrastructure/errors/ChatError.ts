export type ChatErrorKind =
  | "http"
  | "timeout"
  | "network"
  | "transport"
  | "unknown";

export class ChatError extends Error {
  constructor(
    message: string,
    public readonly kind: ChatErrorKind = "unknown",
    public readonly status?: number,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

const HTTP_MESSAGES: Record<number, string> = {
  400: "درخواست شما معتبر نیست. لطفاً دوباره تلاش کنید.",
  401: "دسترسی شما به این سرویس امکان‌پذیر نیست.",
  403: "دسترسی شما به این سرویس امکان‌پذیر نیست.",
  404: "مورد درخواست پیدا نشد. لطفاً دوباره تلاش کنید.",
  408: "زمان پاسخ‌گویی به پایان رسید. لطفاً دوباره تلاش کنید.",
  409: "درخواست با وضعیت فعلی سازگار نیست. لطفاً دوباره تلاش کنید.",
  422: "اطلاعات درخواست معتبر نیست. لطفاً دوباره تلاش کنید.",
  429: "تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
  500: "در پردازش درخواست مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  502: "سرویس موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.",
  503: "سرویس موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.",
  504: "زمان پاسخ‌گویی به پایان رسید. لطفاً دوباره تلاش کنید.",
};

function extractResponseStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  const value = error as {
    response?: { status?: unknown };
    status?: unknown;
  };

  if (typeof value.response?.status === "number") return value.response.status;
  if (typeof value.status === "number") return value.status;
  return undefined;
}

function extractResponseMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;

  const response = (error as { response?: { data?: unknown } }).response;
  const data = response?.data;

  if (typeof data === "string" && data.trim()) {
    try {
      const parsed = JSON.parse(data) as unknown;
      if (parsed && typeof parsed === "object") {
        const value = parsed as Record<string, unknown>;
        for (const key of ["message", "detail", "error"]) {
          if (typeof value[key] === "string" && value[key].trim()) {
            return value[key].trim();
          }
        }
      }
    } catch {
      return data.trim();
    }

    return undefined;
  }

  if (data && typeof data === "object") {
    const value = data as Record<string, unknown>;
    for (const key of ["message", "detail", "error"]) {
      if (typeof value[key] === "string" && value[key].trim()) {
        return value[key].trim();
      }
    }
  }

  return undefined;
}

function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const value = error as { code?: unknown; name?: unknown; message?: unknown };

  return (
    value.code === "ECONNABORTED" ||
    value.code === "ETIMEDOUT" ||
    value.name === "TimeoutError" ||
    (typeof value.message === "string" &&
      /timeout|timed out|time out/i.test(value.message))
  );
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (!error || typeof error !== "object") return false;

  const value = error as {
    code?: unknown;
    response?: unknown;
    request?: unknown;
    message?: unknown;
  };

  if (
    value.code === "ERR_NETWORK" ||
    value.code === "ECONNREFUSED" ||
    value.code === "ECONNRESET" ||
    value.code === "ENOTFOUND" ||
    value.code === "EAI_AGAIN"
  )
    return true;
  if (value.request && !value.response) return true;

  return (
    typeof value.message === "string" &&
    /network|failed to fetch|load failed|connection/i.test(value.message)
  );
}

export function normalizeChatError(
  error: unknown,
  fallback = "درخواست شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
): ChatError {
  if (error instanceof ChatError) return error;

  const status = extractResponseStatus(error);

  if (isTimeoutError(error) || status === 408 || status === 504) {
    return new ChatError(
      HTTP_MESSAGES[status ?? 408],
      "timeout",
      status,
      error,
    );
  }

  if (status !== undefined) {
    return new ChatError(
      HTTP_MESSAGES[status] ?? extractResponseMessage(error) ?? fallback,
      "http",
      status,
      error,
    );
  }

  if (isNetworkError(error)) {
    return new ChatError(
      "ارتباط با سرویس برقرار نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.",
      "network",
      undefined,
      error,
    );
  }

  return new ChatError(fallback, "unknown", undefined, error);
}
