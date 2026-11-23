import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_AVATAR =
    "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833560.jpg?w=740&t=st=1728638508~exp=1728639108~hmac=59fcbd89a8d344fb2797ab35306b6b539a477e5dd919d73e04bd449290c3a5f4";

const UserMenu = ({ userInfo, onLogout }) => {
    const { t } = useTranslation();

    if (!userInfo) {
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
                    className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 rounded-full px-4"
                >
                    <Link to="/sign-up">{t("nav.register")}</Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full ring-offset-background transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Avatar className="h-9 w-9 border border-border/80 shadow-sm">
                        <AvatarImage src={DEFAULT_AVATAR} alt={userInfo?.email || "Avatar"} />
                        <AvatarFallback>
                            {userInfo?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 mt-2 border-border bg-card/95 backdrop-blur-md"
            >
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground">
                            {t("nav.account")}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {userInfo?.email}
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
