import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { subscribeToAuthState } from "@/services/firebase/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        let active = true;
        let unsubscribe = null;
        let timerId = null;

        const startSubscription = () => {
            if (!active) return;
            unsubscribe = subscribeToAuthState((normalizedUser) => {
                if (active) {
                    setUser(normalizedUser);
                    setIsAuthReady(true);
                }
            });
        };

        if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
            timerId = window.requestIdleCallback(startSubscription, { timeout: 300 });
            return () => {
                active = false;
                window.cancelIdleCallback(timerId);
                unsubscribe?.();
            };
        }

        timerId = setTimeout(startSubscription, 0);
        return () => {
            active = false;
            clearTimeout(timerId);
            unsubscribe?.();
        };
    }, []);

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
