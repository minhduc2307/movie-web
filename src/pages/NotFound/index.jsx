import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

const NotFound = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `404 — ${t("brand.name")}`;
    }, [t]);

    return (
        <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
            <header className="app-container relative z-10 flex shrink-0 items-center justify-end gap-1.5 py-3 sm:py-4">
                <LanguageToggle />
                <ThemeToggle />
            </header>

            <img
                src="/moon.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-12 hidden opacity-35 dark:opacity-25 xl:block"
            />
            <img
                src="/astronaut.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-10 right-6 hidden opacity-35 dark:opacity-25 xl:block"
            />

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
                <p className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-foreground">
                    404
                </p>
                <h1 className="mt-4 text-2xl sm:text-4xl font-bold text-foreground">
                    {t("notFound.title")}
                </h1>
                <p className="mt-2 max-w-md text-sm sm:text-base text-muted-foreground">
                    {t("notFound.description")}
                </p>

                <Button
                    asChild
                    size="lg"
                    className="mt-8 h-12 px-7 gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                >
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t("common.backHome")}</span>
                    </Link>
                </Button>
            </main>
        </div>
    );
};

export default NotFound;
