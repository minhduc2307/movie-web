import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Suspense } from "react";
import Spinner from "@components/Spinner";
import HeaderLogined from "@components/HeaderLogined";
import { useUserContext } from "@context/UserProvider";

const Root = () => {
    const { userInfo, setUserInfo } = useUserContext();
    return (
        <div>
            {userInfo ? (
                <HeaderLogined userInfo={userInfo} setUserInfo={setUserInfo} />
            ) : (
                <Header />
            )}
            <Suspense fallback={<Spinner />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};
export default Root;
