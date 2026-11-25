import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Clapperboard, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useUserContext } from "@context/UserProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

const SignIn = () => {
    const { t } = useTranslation();
    const { handleSubmit, register } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { setUserInfo } = useUserContext();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        const { email } = data;
        setUserInfo({ email });
        toast.success(t("auth.loginSuccess"));
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
    };

    return (
        <div className="relative flex min-h-[100dvh] flex-col bg-background text-foreground">
            {/* Top Bar Controls */}
            <div className="relative z-10 mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t("common.backHome")}</span>
                    </Link>
                </Button>
                <div className="flex items-center gap-1.5">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>

            {/* Subtle Ambient Brand Glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-1 items-start justify-center px-4 pb-8 pt-2 sm:items-center sm:py-8">
                <div className="w-full max-w-md">
                    {/* Brand Logo */}
                    <Link to="/" className="mb-4 sm:mb-7 flex items-center justify-center gap-2.5 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-600 text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                        <Clapperboard className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                        {t("brand.name")}
                    </span>
                </Link>

                <Card className="border-border/80 shadow-xl dark:shadow-none">
                    <CardHeader className="space-y-1.5 text-center">
                        <CardTitle className="text-2xl font-bold">
                            {t("auth.loginTitle")}
                        </CardTitle>
                        <CardDescription>
                            {t("auth.loginSubtitle")}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t("auth.emailLabel")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        autoFocus
                                        required
                                        placeholder={t("auth.emailPlaceholder")}
                                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                        className="h-11 pl-10 pr-4"
                                        {...register("email")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        placeholder={t("auth.passwordPlaceholder")}
                                        className="h-11 pl-10 pr-10"
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25"
                            >
                                {t("auth.loginTitle")}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-border/50 pt-5">
                        <p className="text-sm text-muted-foreground">
                            {t("auth.noAccount")}{" "}
                            <Link
                                to="/sign-up"
                                className="font-semibold text-primary hover:underline"
                            >
                                {t("auth.registerNow")}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
