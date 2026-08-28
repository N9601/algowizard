/**
 * Returns `next` only when it is a path on this site, such as "/saved".
 * Absolute URLs, protocol-relative URLs ("//host"), backslash tricks and
 * schemes like "javascript:" fall back, so a crafted login link cannot send
 * a user to another site or run script after they sign in.
 */
export function safeRedirectPath(
  next: string | null | undefined,
  fallback = "/saved"
) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(next)
  ) {
    return fallback;
  }

  return next;
}
