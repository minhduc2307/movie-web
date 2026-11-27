/**
 * Resolves a safe in-app redirect path from router location state (pathname + search + hash).
 * Rejects protocol-relative or backslash paths to prevent open-redirect vulnerabilities.
 */
export const getSafeRedirectPath = (locationState, fallback = "/") => {
    const from = locationState?.from;
    if (!from) return fallback;

    const rawPath =
        typeof from === "string"
            ? from
            : `${from.pathname || ""}${from.search || ""}${from.hash || ""}`;

    if (!rawPath || !rawPath.startsWith("/") || /^\/[\\/]/.test(rawPath)) {
        return fallback;
    }

    try {
        const parsed = new URL(rawPath, "https://local.invalid");
        if (parsed.pathname === "/sign-in" || parsed.pathname === "/sign-up") {
            return fallback;
        }
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return fallback;
    }
};
