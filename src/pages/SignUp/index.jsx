import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Clapperboard,
    User,
    Mail,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useAuth } from "@context/AuthProvider";
import { signUpWithEmail, mapAuthErrorToKey } from "@/services/firebase/authService";
import { getSafeRedirectPath } from "@lib/authRedirect";
import { EMAIL_PATTERN } from "@lib/userUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/common";
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

const SignUp = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthReady } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const redirectTarget = getSafeRedirectPath(location.state, "/");

    useEffect(() => {
        document.title = `${t("auth.registerTitle")} — ${t("brand.name")}`;
    }, [t]);

    useEffect(() => {
        if (isAuthReady && user && !isSubmitting) {
            navigate(redirectTarget, { replace: true });
        }
    }, [isAuthReady, user, isSubmitting, navigate, redirectTarget]);

    const onSubmit = async (data) => {
        clearErrors("root");
        try {
            await signUpWithEmail({
                displayName: data.displayName,
                email: data.email,
                password: data.password,
            });
            toast.success(t("auth.registerSuccess"), { id: "auth-register-success" });
            navigate(redirectTarget, { replace: true });
        } catch (err) {
            const errorKey = mapAuthErrorToKey(err);
            setError("root", { type: "manual", message: errorKey });
            toast.error(t(errorKey), { id: "auth-register-error" });
        }
    };

    return (
        <div className="relative flex min-h-[100dvh] flex-col bg-background text-foreground">
            <header className="app-container relative z-10 flex shrink-0 items-center justify-between py-3 sm:py-4">
                <Button asChild variant="ghost" size="sm" className="min-h-[44px] sm:min-h-0 gap-2 text-muted-foreground hover:text-foreground">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t("common.backHome")}</span>
                    </Link>
                </Button>
                <div className="flex items-center gap-1.5">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </header>

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <main className="relative z-10 flex flex-1 items-start justify-center px-4 pb-8 pt-1 sm:items-center sm:py-8">
                <div className="w-full max-w-md">
                    <Link to="/" className="mb-4 sm:mb-7 flex items-center justify-center gap-2.5 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-700 text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                            <Clapperboard className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-red-700 via-rose-600 to-amber-700 dark:from-red-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
                            {t("brand.name")}
                        </span>
                    </Link>

                    <Card className="border-border/80 shadow-xl dark:shadow-none">
                        <CardHeader className="space-y-1 p-5 pb-4 sm:p-6 sm:pb-4 text-center">
                            <CardTitle className="text-xl sm:text-2xl font-bold">
                                {t("auth.registerTitle")}
                            </CardTitle>
                            <CardDescription>
                                {t("auth.registerSubtitle")}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4" noValidate>
                                {errors.root?.message && (
                                    <div
                                        role="alert"
                                        className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-xs font-medium text-destructive dark:text-rose-400"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{t(errors.root.message)}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="displayName">{t("auth.displayNameLabel")}</Label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="displayName"
                                            type="text"
                                            autoFocus
                                            autoComplete="name"
                                            placeholder={t("auth.displayNamePlaceholder")}
                                            aria-invalid={Boolean(errors.displayName)}
                                            className={`h-11 pl-10 pr-4 ${
                                                errors.displayName ? "border-destructive focus-visible:ring-destructive" : ""
                                            }`}
                                            {...register("displayName", {
                                                required: "auth.errors.displayNameRequired",
                                                validate: (val) => {
                                                    const len = val.trim().length;
                                                    if (len < 2) return "auth.errors.displayNameTooShort";
                                                    if (len > 40) return "auth.errors.displayNameTooLong";
                                                    return true;
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.displayName?.message && (
                                        <p className="text-xs font-medium text-destructive dark:text-rose-400">
                                            {t(errors.displayName.message)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("auth.emailLabel")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder={t("auth.emailPlaceholder")}
                                            aria-invalid={Boolean(errors.email)}
                                            className={`h-11 pl-10 pr-4 ${
                                                errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                                            }`}
                                            {...register("email", {
                                                required: "auth.errors.emailRequired",
                                                pattern: {
                                                    value: EMAIL_PATTERN,
                                                    message: "auth.errors.invalidEmail",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email?.message && (
                                        <p className="text-xs font-medium text-destructive dark:text-rose-400">
                                            {t(errors.email.message)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
                                    <PasswordInput
                                        id="password"
                                        autoComplete="new-password"
                                        placeholder={t("auth.passwordPlaceholder")}
                                        toggleLabel={t("auth.togglePasswordVisibility")}
                                        error={errors.password}
                                        {...register("password", {
                                            required: "auth.errors.passwordRequired",
                                            minLength: {
                                                value: 6,
                                                message: "auth.errors.weakPassword",
                                            },
                                        })}
                                    />
                                    {errors.password?.message && (
                                        <p className="text-xs font-medium text-destructive dark:text-rose-400">
                                            {t(errors.password.message)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        {t("auth.confirmPasswordLabel")}
                                    </Label>
                                    <PasswordInput
                                        id="confirmPassword"
                                        autoComplete="new-password"
                                        placeholder={t("auth.confirmPasswordPlaceholder")}
                                        toggleLabel={t("auth.toggleConfirmPasswordVisibility")}
                                        error={errors.confirmPassword}
                                        {...register("confirmPassword", {
                                            required: "auth.errors.confirmPasswordRequired",
                                            validate: (val) =>
                                                val === watch("password") || "auth.passwordMismatch",
                                        })}
                                    />
                                    {errors.confirmPassword?.message && (
                                        <p className="text-xs font-medium text-destructive dark:text-rose-400">
                                            {t(errors.confirmPassword.message)}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 h-11 w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 gap-2"
                                >
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>{t("auth.registerTitle")}</span>
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="justify-center border-t border-border/50 pt-5">
                            <p className="text-sm text-muted-foreground">
                                {t("auth.hasAccount")}{" "}
                                <Link
                                    to="/sign-in"
                                    state={location.state}
                                    className="font-semibold text-primary dark:text-rose-400 hover:underline"
                                >
                                    {t("auth.loginNow")}
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default SignUp;
