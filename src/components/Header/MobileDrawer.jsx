import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    X,
    Heart,
    LogOut,
    Clapperboard,
    Home,
    Film,
    Tv,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { getUserInitial } from "@lib/userUtils";
import { cn } from "@/lib/utils";

const MobileDrawer = ({ open, user, isAuthReady, onClose, onLogout }) => {
    const { t } = useTranslation();
    const location = useLocation();

    if (!open) return null;

    const currentFullUrl = `${location.pathname}${location.search}`;
    const mobileNavItems = [
        { name: t("nav.home"), href: "/", icon: Home },
        { name: t("nav.movies"), href: "/movies", icon: Clapperboard },
        { name: t("nav.singleMovies"), href: "/movies?type=phim-le", icon: Film },
        { name: t("nav.series"), href: "/movies?type=phim-bo", icon: Tv },
        { name: t("nav.anime"), href: "/movies?type=hoat-hinh", icon: Sparkles },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
            <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 left-0 z-[101] flex h-[100dvh] w-4/5 max-w-xs flex-col justify-between overflow-y-auto border-r border-border bg-card p-6 shadow-2xl animate-in slide-in-from-left duration-200">
                <div>
                    <div className="flex items-center justify-between pb-5 border-b border-border/60">
                        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-rose-600 text-primary-foreground shadow-sm">
                                <Clapperboard className="h-4 w-4" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                                {t("brand.name")}
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full"
                            aria-label={t("nav.closeMenu")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <nav className="mt-5 flex flex-col space-y-1.5">
                        {mobileNavItems.map((item) => {
                            const isActive = currentFullUrl === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        {user && (
                            <Link
                                to="/favorites"
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                                    location.pathname === "/favorites"
                                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                                <span>{t("nav.favorites")}</span>
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="pt-5 border-t border-border/60 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t("nav.language")}
                        </span>
                        <LanguageToggle />
                    </div>
                    <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t("nav.theme")}
                        </span>
                        <ThemeToggle />
                    </div>

                    {isAuthReady && user && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-border">
                                    {user.photoURL && (
                                        <AvatarImage
                                            src={user.photoURL}
                                            alt={user.displayName || user.email || "Avatar"}
                                        />
                                    )}
                                    <AvatarFallback className="bg-primary/15 text-primary font-bold">
                                        {getUserInitial(user)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold truncate text-foreground">
                                        {user.displayName || t("nav.loggedIn")}
                                    </p>
                                    <p className="text-xs truncate text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive hover:text-destructive flex items-center justify-center gap-2"
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t("nav.logout")}</span>
                            </Button>
                        </div>
                    )}

                    {isAuthReady && !user && (
                        <div className="flex flex-col gap-2 pt-2">
                            <Button asChild variant="outline" className="w-full justify-center">
                                <Link to="/sign-in" onClick={onClose}>
                                    {t("nav.login")}
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="w-full justify-center font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Link to="/sign-up" onClick={onClose}>
                                    {t("nav.register")}
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MobileDrawer;
