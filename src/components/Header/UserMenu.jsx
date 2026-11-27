import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, LogOut } from "lucide-react";
import { getUserInitial } from "@lib/userUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserMenu = ({ user, isAuthReady, onLogout }) => {
    const { t } = useTranslation();

    if (!isAuthReady) {
        return <Skeleton className="ml-1 h-11 w-11 sm:h-9 sm:w-9 rounded-full" />;
    }

    if (!user) {
        return (
            <div className="flex items-center gap-1.5 ml-1">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hidden sm:inline-flex font-medium"
                >
                    <Link to="/sign-in">{t("nav.login")}</Link>
                </Button>
                <Button
                    asChild
                    size="sm"
                    className="h-11 sm:h-9 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 rounded-full px-4"
                >
                    <Link to="/sign-up">{t("nav.register")}</Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={user.displayName || user.email || t("nav.account")}
                    className="ml-1 flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-full ring-offset-background transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <Avatar className="h-9 w-9 border border-border/80 shadow-sm">
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
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-60 mt-2 border-border bg-card/95 backdrop-blur-md"
            >
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground truncate">
                            {user.displayName || t("nav.account")}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        to="/favorites"
                        className="flex cursor-pointer items-center gap-2 font-medium"
                    >
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                        <span>{t("nav.favorites")}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2 font-medium"
                >
                    <LogOut className="h-4 w-4" />
                    <span>{t("nav.logout")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
