export type ApiErrorLike = {
  status?: number | string;
  error?: string;
  message?: string;
  data?: unknown;
};

type ProblemDetails = {
  title?: string;
  detail?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
  type?: string;
  status?: number;
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "درخواست نامعتبر است.",
  401: "احراز هویت شما معتبر نیست یا نشست شما منقضی شده است.",
  403: "شما مجوز انجام این عملیات را ندارید.",
  404: "منبع موردنظر پیدا نشد.",
  409: "این عملیات با وضعیت فعلی منبع تداخل دارد یا داده تکراری است.",
  422: "اطلاعات واردشده معتبر نیست.",
  500: "خطایی در سرور رخ داده است.",
  502: "ارتباط با سرویس بالادستی برقرار نشد.",
  503: "سرویس موقتاً در دسترس نیست.",
};

function getStatus(error: ApiErrorLike): number | undefined {
  return typeof error.status === "number"
    ? error.status
    : typeof error.status === "string" && /^\d+$/.test(error.status)
      ? Number(error.status)
      : undefined;
}

function getValidationMessage(
  errors: Record<string, string[] | string> | undefined,
) {
  if (!errors) return undefined;

  const messages = Object.values(errors)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => Boolean(value?.trim()));

  return messages.length ? messages.join("، ") : undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "عملیات انجام نشد.",
): string {
  if (!error) return fallback;

  const value =
    typeof error === "object" && error !== null
      ? (error as ApiErrorLike)
      : undefined;

  const status = value ? getStatus(value) : undefined;

  if (status === undefined && value?.error === "FETCH_ERROR") {
    return "ارتباط با سرور برقرار نشد. اتصال شبکه و آدرس سرویس را بررسی کنید.";
  }

  if (status && STATUS_MESSAGES[status]) {
    const data =
      value?.data && typeof value.data === "object"
        ? (value.data as ProblemDetails)
        : undefined;

    const validation = getValidationMessage(data?.errors);
    return (
      validation ??
      data?.detail ??
      data?.message ??
      data?.error ??
      data?.title ??
      STATUS_MESSAGES[status]
    );
  }

  if (typeof value?.data === "string" && value.data.trim()) {
    return value.data;
  }

  if (value?.data && typeof value.data === "object") {
    const data = value.data as ProblemDetails;
    return (
      getValidationMessage(data.errors) ??
      data.detail ??
      data.message ??
      data.error ??
      data.title ??
      value.error ??
      value.message ??
      fallback
    );
  }

  if (value?.error && value.error !== "FETCH_ERROR") return value.error;
  if (value?.message) return value.message;
  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
