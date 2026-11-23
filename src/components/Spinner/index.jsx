import { Clapperboard, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Spinner = ({ fullScreen = false }) => {
    const { t } = useTranslation();

    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 bg-background text-foreground ${
                fullScreen ? "min-h-screen" : "min-h-[60vh]"
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="relative flex items-center justify-center">
                {/* Ambient pulse ring */}
                <div className="absolute h-16 w-16 rounded-2xl bg-primary/20 animate-ping" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-rose-600 text-primary-foreground shadow-lg shadow-primary/30">
                    <Clapperboard className="h-7 w-7" />
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>{t("common.loading")}</span>
            </div>
        </div>
    );
};

export default Spinner;
