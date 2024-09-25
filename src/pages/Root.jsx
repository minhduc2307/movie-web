import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Suspense } from "react";
import Spinner from "@components/Spinner";

const Root = () => {
    return (
        <div>
            <Header />
            <Suspense fallback={<Spinner />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};
export default Root;
