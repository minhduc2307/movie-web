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
    MonitorPlay,
    Sparkles,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { getUserInitial } from "@lib/userUtils";

const MobileDrawer = ({ open, onOpenChange, user, isAuthReady, onLogout }) => {
    const { t } = useTranslation();
    const location = useLocation();

    const closeDrawer = () => onOpenChange(false);
    const currentFullUrl = `${location.pathname}${location.search}`;
    const mobileNavItems = [
        { name: t("nav.home"), href: "/", icon: Home },
        { name: t("nav.movies"), href: "/movies", icon: Clapperboard },
        { name: t("nav.singleMovies"), href: "/movies?type=phim-le", icon: Film },
        { name: t("nav.series"), href: "/movies?type=phim-bo", icon: Tv },
        { name: t("nav.anime"), href: "/movies?type=hoat-hinh", icon: Sparkles },
        { name: t("nav.tvShows"), href: "/movies?type=tv-shows", icon: MonitorPlay },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="left"
                hideCloseButton
                className="flex w-4/5 max-w-xs flex-col justify-between border-r border-border bg-card p-0 md:hidden"
            >
                <SheetHeader className="flex-row items-center justify-between space-y-0 px-6 pb-4 pt-5 text-left">
                    <SheetTitle asChild>
                        <Link to="/" className="flex items-center gap-2" onClick={closeDrawer}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-rose-700 text-primary-foreground shadow-sm">
                                <Clapperboard className="h-4 w-4" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-red-700 to-amber-700 dark:from-red-400 dark:to-amber-400 bg-clip-text text-transparent">
                                {t("brand.name")}
                            </span>
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        {t("nav.categories")}
                    </SheetDescription>
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-full"
                            aria-label={t("nav.closeMenu")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetClose>
                </SheetHeader>

                <Separator />

                <ScrollArea className="flex-1 min-h-0 px-4 py-4">
                    <nav className="flex flex-col space-y-1">
                        {mobileNavItems.map((item) => {
                            const isActive = currentFullUrl === item.href;
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.href}
                                    asChild
                                    variant={isActive ? "default" : "ghost"}
                                    className="h-11 w-full justify-start gap-3 px-3.5 text-sm font-medium"
                                >
                                    <Link to={item.href} onClick={closeDrawer}>
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </Button>
                            );
                        })}

                        {user && (
                            <>
                                <Button
                                    asChild
                                    variant={location.pathname === "/favorites" ? "default" : "ghost"}
                                    className="h-11 w-full justify-start gap-3 px-3.5 text-sm font-medium"
                                >
                                    <Link to="/favorites" onClick={closeDrawer}>
                                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                                        <span>{t("nav.favorites")}</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant={location.pathname === "/profile" ? "default" : "ghost"}
                                    className="h-11 w-full justify-start gap-3 px-3.5 text-sm font-medium"
                                >
                                    <Link to="/profile" onClick={closeDrawer}>
                                        <User className="h-4 w-4" />
                                        <span>{t("nav.profile")}</span>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </ScrollArea>

                <Separator />

                <div className="space-y-4 p-6 pt-4">
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
                                    <AvatarFallback className="bg-primary/15 text-primary dark:text-rose-400 font-bold">
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
                                className="w-full h-10 text-destructive dark:text-rose-400 hover:text-destructive flex items-center justify-center gap-2"
                                onClick={() => {
                                    onLogout();
                                    closeDrawer();
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t("nav.logout")}</span>
                            </Button>
                        </div>
                    )}

                    {isAuthReady && !user && (
                        <div className="flex flex-col gap-2 pt-2">
                            <Button asChild variant="outline" className="w-full h-11 justify-center">
                                <Link to="/sign-in" onClick={closeDrawer}>
                                    {t("nav.login")}
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="w-full h-11 justify-center font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Link to="/sign-up" onClick={closeDrawer}>
                                    {t("nav.register")}
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileDrawer;
