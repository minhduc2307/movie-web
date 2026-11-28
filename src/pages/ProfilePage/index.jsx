import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { User, Lock, Heart, History, Trash2, Loader2, Save } from "lucide-react";
import { useAuth } from "@context/AuthProvider";
import { useFavorites } from "@context/FavoritesProvider";
import { useWatchHistory } from "@context/WatchHistoryProvider";
import {
    changeUserPassword,
    mapAuthErrorToKey,
    updateUserDisplayName,
} from "@/services/firebase/authService";
import { getUserInitial } from "@lib/userUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/common";

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { favorites } = useFavorites();
    const { history, clearHistory } = useWatchHistory();

    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [savingName, setSavingName] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [clearingHistory, setClearingHistory] = useState(false);

    useEffect(() => {
        document.title = `${t("profile.title")} — ${t("brand.name")}`;
    }, [t]);

    useEffect(() => {
        setDisplayName(user?.displayName || "");
    }, [user?.displayName]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        const trimmed = displayName.trim();
        if (trimmed.length < 2 || trimmed.length > 40) {
            toast.error(
                trimmed.length < 2
                    ? t("auth.errors.displayNameTooShort")
                    : t("auth.errors.displayNameTooLong"),
                { id: "profile-name-err" }
            );
            return;
        }
        setSavingName(true);
        try {
            await updateUserDisplayName(trimmed);
            toast.success(t("profile.nameUpdated"), { id: "profile-name-ok" });
        } catch (err) {
            toast.error(t(mapAuthErrorToKey(err)), { id: "profile-name-err" });
        } finally {
            setSavingName(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            toast.error(t("auth.errors.passwordRequired"), { id: "profile-pw-err" });
            return;
        }
        if (newPassword.length < 6) {
            toast.error(t("auth.errors.weakPassword"), { id: "profile-pw-err" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error(t("auth.passwordMismatch"), { id: "profile-pw-err" });
            return;
        }

        setSavingPassword(true);
        try {
            await changeUserPassword({ currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success(t("profile.passwordUpdated"), { id: "profile-pw-ok" });
        } catch (err) {
            toast.error(t(mapAuthErrorToKey(err)), { id: "profile-pw-err" });
        } finally {
            setSavingPassword(false);
        }
    };

    const handleClearHistory = async () => {
        setClearingHistory(true);
        try {
            await clearHistory();
            toast.success(t("profile.historyCleared"), { id: "profile-history-ok" });
        } finally {
            setClearingHistory(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 text-foreground sm:py-12">
            <div className="app-container max-w-4xl space-y-6">
                <Card className="border-border/80 bg-card/80">
                    <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border border-border">
                                {user?.photoURL && (
                                    <AvatarImage src={user.photoURL} alt={user.displayName || "Avatar"} />
                                )}
                                <AvatarFallback className="bg-primary/15 text-xl font-bold text-primary dark:text-rose-400">
                                    {getUserInitial(user)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {user?.displayName || t("nav.account")}
                                </h1>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline" size="sm" className="gap-1.5">
                                <Link to="/favorites">
                                    <Heart className="h-4 w-4 text-rose-500" />
                                    <span>{t("nav.favorites")}</span>
                                    <Badge variant="secondary">{favorites.length}</Badge>
                                </Link>
                            </Button>
                            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium">
                                <History className="h-3.5 w-3.5 text-primary dark:text-rose-400" />
                                <span>{t("profile.historyCount", { count: history.length })}</span>
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="border-border/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-primary dark:text-rose-400" />
                                <span>{t("profile.basicInfo")}</span>
                            </CardTitle>
                            <CardDescription>{t("profile.basicInfoDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateName} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="profile-display-name">{t("auth.displayNameLabel")}</Label>
                                    <Input
                                        id="profile-display-name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder={t("auth.displayNamePlaceholder")}
                                        maxLength={40}
                                    />
                                </div>
                                <Button type="submit" disabled={savingName} className="gap-2">
                                    {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    <span>{t("profile.saveChanges")}</span>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-border/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lock className="h-5 w-5 text-primary dark:text-rose-400" />
                                <span>{t("profile.security")}</span>
                            </CardTitle>
                            <CardDescription>{t("profile.securityDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="profile-curr-pw">{t("profile.currentPassword")}</Label>
                                    <PasswordInput
                                        id="profile-curr-pw"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="profile-new-pw">{t("profile.newPassword")}</Label>
                                    <PasswordInput
                                        id="profile-new-pw"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="profile-confirm-pw">{t("auth.confirmPasswordLabel")}</Label>
                                    <PasswordInput
                                        id="profile-confirm-pw"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <Button type="submit" disabled={savingPassword} className="gap-2">
                                    {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>{t("profile.updatePassword")}</span>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {history.length > 0 && (
                    <Card className="border-border/80">
                        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-base font-bold">{t("profile.clearHistoryTitle")}</h2>
                                <p className="text-sm text-muted-foreground">{t("profile.clearHistoryDesc")}</p>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={clearingHistory}
                                onClick={handleClearHistory}
                                className="gap-2 shrink-0"
                            >
                                {clearingHistory ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                <span>{t("profile.clearHistoryBtn")}</span>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
