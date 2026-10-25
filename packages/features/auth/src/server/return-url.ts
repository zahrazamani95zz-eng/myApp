export function isSafeReturnUrl(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) {
    return false;
  }
  if (trimmed.startsWith("//")) {
    return false;
  }
  if (trimmed.includes("\\")) {
    return false;
  }
  if (trimmed.includes("://")) {
    return false;
  }
  // Encoded variants of the same tricks (%2F%2F -> "//", %5C -> "\").
  if (/%2f%2f/i.test(trimmed) || /%5c/i.test(trimmed)) {
    return false;
  }

  return true;
}

export function sanitizeReturnUrl(
  value: string | null | undefined,
  fallback = "/",
): string {
  return isSafeReturnUrl(value) ? (value as string).trim() : fallback;
}
