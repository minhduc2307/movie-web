import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AUTH_CRITICAL_PATHS = ["/favorites", "/rooms", "/sign-in", "/sign-up"];
const IDLE_AUTH_TIMEOUT_MS = 2000;

const hasPersistedFirebaseSession = () => {
    if (typeof window === "undefined") return false;
    try {
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (key && key.startsWith("firebase:authUser:")) {
                return true;
            }
        }
    } catch {
        // Ignore storage access errors in restricted environments
    }
    return false;
};

const isAuthCriticalPath = () => {
    if (typeof window === "undefined") return false;
    const { pathname } = window.location;
    return AUTH_CRITICAL_PATHS.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const AuthProvider = ({ children }) => {
    const [shouldEagerLoad] = useState(
        () => hasPersistedFirebaseSession() || isAuthCriticalPath()
    );
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(() => !shouldEagerLoad);

    useEffect(() => {
        let active = true;
        let started = false;
        let unsubscribe = null;
        let idleId = null;
        let fallbackTimerId = null;

        const cleanupTriggers = () => {
            if (typeof window === "undefined") return;
            window.removeEventListener("pointerdown", startSubscription);
            window.removeEventListener("keydown", startSubscription);
            window.removeEventListener("load", scheduleIdleStart);
            if (idleId !== null && typeof window.cancelIdleCallback === "function") {
                window.cancelIdleCallback(idleId);
                idleId = null;
            }
            if (fallbackTimerId !== null) {
                clearTimeout(fallbackTimerId);
                fallbackTimerId = null;
            }
        };

        const startSubscription = () => {
            if (!active || started) return;
            started = true;
            cleanupTriggers();

            import("@/services/firebase/authService")
                .then(({ subscribeToAuthState }) => {
                    if (!active) return;
                    unsubscribe = subscribeToAuthState((normalizedUser) => {
                        if (active) {
                            setUser(normalizedUser);
                            setIsAuthReady(true);
                        }
                    });
                })
                .catch(() => {
                    if (active) {
                        setIsAuthReady(true);
                    }
                });
        };

        const scheduleIdleStart = () => {
            if (!active || started) return;
            if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
                idleId = window.requestIdleCallback(startSubscription, {
                    timeout: IDLE_AUTH_TIMEOUT_MS,
                });
            } else {
                fallbackTimerId = setTimeout(startSubscription, IDLE_AUTH_TIMEOUT_MS);
            }
        };

        if (shouldEagerLoad) {
            startSubscription();
        } else if (typeof window !== "undefined") {
            window.addEventListener("pointerdown", startSubscription, {
                once: true,
                passive: true,
            });
            window.addEventListener("keydown", startSubscription, {
                once: true,
                passive: true,
            });
            if (document.readyState === "complete") {
                scheduleIdleStart();
            } else {
                window.addEventListener("load", scheduleIdleStart, { once: true });
            }
        }

        return () => {
            active = false;
            cleanupTriggers();
            unsubscribe?.();
        };
    }, [shouldEagerLoad]);

    const value = useMemo(
        () => ({ user, isAuthReady }),
        [user, isAuthReady]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
