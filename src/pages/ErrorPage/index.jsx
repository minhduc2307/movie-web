import { useRouteError, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
    const { t } = useTranslation();
    const error = useRouteError();
    console.error("Route error:", error);

    const errorMessage =
        error?.statusText || error?.message || t("errorPage.descriptionFallback");

    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 text-foreground">
            <div className="max-w-md text-center">
                <h1 className="mb-4 text-6xl font-extrabold text-primary dark:text-rose-400">
                    {error?.status || t("errorPage.codeFallback")}
                </h1>
                <h2 className="mb-2 text-2xl font-bold">
                    {t("errorPage.title")}
                </h2>
                <p className="mb-6 text-muted-foreground">{errorMessage}</p>
                <Button asChild size="lg" className="h-12 gap-2 rounded-xl px-6 font-semibold">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t("common.backHome")}</span>
                    </Link>
                </Button>
            </div>
        </main>
    );
};

export default ErrorPage;
