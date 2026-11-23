import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeProvider";

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            title={isDark ? "Chế độ sáng (Light Mode)" : "Chế độ tối (Dark Mode)"}
            className={`relative rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ${className}`}
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
    );
};

export default ThemeToggle;
