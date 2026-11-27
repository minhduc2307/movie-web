import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/common";
import { useTheme } from "@/context/ThemeProvider";

const ThemeToggle = ({ className = "" }) => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const modeLabel = isDark ? t("common.lightMode") : t("common.darkMode");

    return (
        <AppTooltip label={modeLabel}>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={isDark ? t("common.switchToLight") : t("common.switchToDark")}
                className={`relative h-11 w-11 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ${className}`}
            >
                <Sun
                    className={`h-5 w-5 transition-all duration-300 ${
                        isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    }`}
                />
                <Moon
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                        isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    }`}
                />
            </Button>
        </AppTooltip>
    );
};

export default ThemeToggle;
