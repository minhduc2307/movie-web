import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "@context/UserProvider";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
    const { userInfo } = useUserContext();
    const location = useLocation();

    useEffect(() => {
        if (!userInfo) {
            toast.error("Vui lòng đăng nhập để truy cập danh sách yêu thích");
        }
    }, [userInfo]);

    if (!userInfo) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
