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
        const unsubscribe = subscribeToAuthState((normalizedUser) => {
            setUser(normalizedUser);
            setIsAuthReady(true);
        });
        return unsubscribe;
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
