import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@context/AuthProvider";
import Spinner from "@components/Spinner";

const ProtectedRoute = ({ children }) => {
    const { t } = useTranslation();
    const { user, isAuthReady } = useAuth();
    const location = useLocation();
    const wasAuthenticatedRef = useRef(Boolean(user));

    if (user) {
        wasAuthenticatedRef.current = true;
    }

    useEffect(() => {
        // Avoid showing an error toast when the user intentionally signs out while on a protected route
        if (isAuthReady && !user && !wasAuthenticatedRef.current) {
            toast.error(t("auth.loginRequired"), { id: "auth-required" });
        }
    }, [isAuthReady, user, t]);

    if (!isAuthReady) {
        return <Spinner fullScreen />;
    }

    if (!user) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
