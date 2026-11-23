import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Suspense } from "react";
import Spinner from "@components/Spinner";
import { Toaster } from "sonner";
import { useTheme } from "@/context/ThemeProvider";

const Root = () => {
    const { theme } = useTheme();
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
            <Toaster richColors position="top-right" theme={theme} />
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
