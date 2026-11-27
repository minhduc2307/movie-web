import { lazy, Suspense, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@context/AuthProvider";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/common";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import HeaderSearch from "./HeaderSearch";
import UserMenu from "./UserMenu";

const MobileDrawer = lazy(() => import("./MobileDrawer"));

const Header = () => {
    const { t } = useTranslation();
    const [showMenuDrawer, setShowMenuDrawer] = useState(false);
    const [hasOpenedDrawer, setHasOpenedDrawer] = useState(false);
    const { user, isAuthReady } = useAuth();

    const handleLogout = useCallback(async () => {
        try {
            const { signOutUser } = await import("@/services/firebase/authService");
            await signOutUser();
            toast.info(t("nav.loggedOutToast"), { id: "auth-logout" });
        } catch {
            toast.error(t("auth.errors.unknown"), { id: "auth-logout-err" });
        }
    }, [t]);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
            <div className="app-container flex h-16 items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <AppTooltip label={t("nav.openMenu")}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-11 w-11 text-foreground hover:bg-muted"
                            onClick={() => {
                                setHasOpenedDrawer(true);
                                setShowMenuDrawer(true);
                            }}
                            aria-label={t("nav.openMenu")}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </AppTooltip>

                    <Link to="/" className="flex items-center gap-2.5 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-700 text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
                            <Clapperboard className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xl min-[2000px]:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-red-700 via-rose-600 to-amber-700 dark:from-red-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
                                {t("brand.name")}
                            </span>
                            <span className="hidden xl:inline-block border-l border-border pl-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {t("brand.tagline")}
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="hidden lg:flex flex-1 justify-center px-4">
                    <HeaderSearch />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <LanguageToggle className="hidden sm:inline-flex" />
                    <ThemeToggle />
                    <UserMenu user={user} isAuthReady={isAuthReady} onLogout={handleLogout} />
                </div>
            </div>

            <div className="border-t border-border/40 px-4 py-2 lg:hidden">
                <HeaderSearch className="max-w-full" />
            </div>

            {hasOpenedDrawer && (
                <Suspense fallback={null}>
                    <MobileDrawer
                        open={showMenuDrawer}
                        onOpenChange={setShowMenuDrawer}
                        user={user}
                        isAuthReady={isAuthReady}
                        onLogout={handleLogout}
                    />
                </Suspense>
            )}
        </header>
    );
};

export default Header;
