export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getSafeDisplayName = (user, fallback = "Member") =>
    String(user?.displayName || user?.email?.split("@")?.[0] || fallback)
        .trim()
        .slice(0, 50) || fallback;

export const getUserInitial = (user) => {
    const source = user?.displayName || user?.name || user?.email || "U";
    return source.trim().charAt(0).toUpperCase() || "U";
};

export const createClientId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
