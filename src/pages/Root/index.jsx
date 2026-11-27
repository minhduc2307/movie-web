import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Spinner from "@components/Spinner";

const Root = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
            <Header />
            <main className="flex-1">
                <Suspense fallback={<Spinner />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default Root;
