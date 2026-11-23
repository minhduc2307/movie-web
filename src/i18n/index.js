import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

const LANG_STORAGE_KEY = "motphim-lang";

const getInitialLanguage = () => {
    try {
        const stored = localStorage.getItem(LANG_STORAGE_KEY);
        if (stored === "vi" || stored === "en") {
            return stored;
        }
    } catch {
        // ignore
    }
    return "vi";
};

i18n.use(initReactI18next).init({
    resources: {
        vi: { translation: vi },
        en: { translation: en },
    },
    lng: getInitialLanguage(),
    fallbackLng: "vi",
    interpolation: {
        escapeValue: false,
    },
});

i18n.on("languageChanged", (lng) => {
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lng);
        document.documentElement.lang = lng;
    } catch {
        // ignore
    }
});

export default i18n;
