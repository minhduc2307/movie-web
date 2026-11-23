import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "motphim-theme";
const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

const getInitialTheme = () => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
            return stored;
        }
        if (
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-color-scheme: light)").matches
        ) {
            return "light";
        }
    } catch {
        // Fallback if localStorage is blocked
    }
    return "dark";
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        root.style.colorScheme = theme;

        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                "content",
                theme === "dark" ? "#121622" : "#ffffff"
            );
        }

        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // Ignore write errors
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
