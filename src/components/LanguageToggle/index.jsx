import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = ({ className = "" }) => {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language === "en" ? "en" : "vi";

    const toggleLanguage = () => {
        i18n.changeLanguage(currentLang === "vi" ? "en" : "vi");
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label={`${currentLang.toUpperCase()} - ${t("nav.language")}`}
            title={currentLang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            className={`h-11 min-w-[44px] sm:h-9 sm:min-w-0 px-2.5 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/80 gap-1.5 ${className}`}
        >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{currentLang}</span>
        </Button>
    );
};

export default LanguageToggle;
