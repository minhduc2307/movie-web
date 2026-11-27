import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Clapperboard,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useAuth } from "@context/AuthProvider";
import { signInWithEmail, mapAuthErrorToKey } from "@/services/firebase/authService";
import { getSafeRedirectPath } from "@lib/authRedirect";
import { EMAIL_PATTERN } from "@lib/userUtils";
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
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthReady } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { email: "", password: "" },
    });

    const redirectTarget = getSafeRedirectPath(location.state, "/");

    useEffect(() => {
        if (isAuthReady && user && !isSubmitting) {
            navigate(redirectTarget, { replace: true });
        }
    }, [isAuthReady, user, isSubmitting, navigate, redirectTarget]);

    const onSubmit = async (data) => {
        clearErrors("root");
        try {
            await signInWithEmail(data);
            toast.success(t("auth.loginSuccess"), { id: "auth-login-success" });
            navigate(redirectTarget, { replace: true });
        } catch (err) {
            const message = t(mapAuthErrorToKey(err));
            setError("root", { type: "manual", message });
            toast.error(message, { id: "auth-login-error" });
        }
    };

    return (
        <div className="relative flex min-h-[100dvh] flex-col bg-background text-foreground">
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

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-1 items-start justify-center px-4 pb-8 pt-2 sm:items-center sm:py-8">
                <div className="w-full max-w-md">
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
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                                {errors.root?.message && (
                                    <div
                                        role="alert"
                                        className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-xs font-medium text-destructive"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{errors.root.message}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("auth.emailLabel")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="email"
                                            type="email"
                                            autoFocus
                                            autoComplete="email"
                                            placeholder={t("auth.emailPlaceholder")}
                                            aria-invalid={Boolean(errors.email)}
                                            className={`h-11 pl-10 pr-4 ${
                                                errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                                            }`}
                                            {...register("email", {
                                                required: t("auth.errors.emailRequired"),
                                                pattern: {
                                                    value: EMAIL_PATTERN,
                                                    message: t("auth.errors.invalidEmail"),
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email?.message && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            placeholder={t("auth.passwordPlaceholder")}
                                            aria-invalid={Boolean(errors.password)}
                                            className={`h-11 pl-10 pr-10 ${
                                                errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                                            }`}
                                            {...register("password", {
                                                required: t("auth.errors.passwordRequired"),
                                                minLength: {
                                                    value: 6,
                                                    message: t("auth.errors.weakPassword"),
                                                },
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={t("auth.togglePasswordVisibility")}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password?.message && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 h-11 w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 gap-2"
                                >
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>{t("auth.loginTitle")}</span>
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="justify-center border-t border-border/50 pt-5">
                            <p className="text-sm text-muted-foreground">
                                {t("auth.noAccount")}{" "}
                                <Link
                                    to="/sign-up"
                                    state={location.state}
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
