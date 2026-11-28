import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

const rootDir = import.meta.dirname;

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(rootDir, "src"),
            "@components": path.resolve(rootDir, "src/components"),
            "@lib": path.resolve(rootDir, "src/lib"),
            "@pages": path.resolve(rootDir, "src/pages"),
            "@context": path.resolve(rootDir, "src/context"),
            "@hooks": path.resolve(rootDir, "src/hooks"),
            "@features": path.resolve(rootDir, "src/features"),
            "@services": path.resolve(rootDir, "src/services"),
        },
    },
    test: {
        environment: "jsdom",
        globals: false,
        clearMocks: true,
    },
});
