import { Toaster } from "sonner";
import { useTheme } from "@/context/ThemeProvider";

const AppToaster = () => {
    const { theme } = useTheme();
    return <Toaster richColors position="top-right" theme={theme} />;
};

export default AppToaster;
