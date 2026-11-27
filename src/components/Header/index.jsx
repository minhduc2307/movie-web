import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@context/AuthProvider";
import { signOutUser } from "@/services/firebase/authService";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import HeaderSearch from "./HeaderSearch";
import UserMenu from "./UserMenu";
import MobileDrawer from "./MobileDrawer";

const Header = () => {
    const { t } = useTranslation();
    const [showMenuDrawer, setShowMenuDrawer] = useState(false);
    const { user, isAuthReady } = useAuth();

    useEffect(() => {
        if (!showMenuDrawer) return;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setShowMenuDrawer(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showMenuDrawer]);

    const handleLogout = useCallback(async () => {
        try {
            await signOutUser();
            toast.info(t("nav.loggedOutToast"), { id: "auth-logout" });
        } catch {
            toast.error(t("auth.errors.unknown"), { id: "auth-logout-err" });
        }
    }, [t]);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
            <div className="mx-auto flex h-16 max-w-7xl 2xl:max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-foreground hover:bg-muted"
                        onClick={() => setShowMenuDrawer(true)}
                        aria-label={t("nav.openMenu")}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-600 text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
                            <Clapperboard className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                                {t("brand.name")}
                            </span>
                            <span className="hidden xl:inline-block border-l border-border pl-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {t("brand.tagline")}
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 justify-center px-4">
                    <HeaderSearch />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <LanguageToggle className="hidden sm:inline-flex" />
                    <ThemeToggle />
                    <UserMenu user={user} isAuthReady={isAuthReady} onLogout={handleLogout} />
                </div>
            </div>

            <div className="border-t border-border/40 px-4 py-2 md:hidden">
                <HeaderSearch className="max-w-full" />
            </div>

            <MobileDrawer
                open={showMenuDrawer}
                user={user}
                isAuthReady={isAuthReady}
                onClose={() => setShowMenuDrawer(false)}
                onLogout={handleLogout}
            />
        </header>
    );
};

export default Header;
