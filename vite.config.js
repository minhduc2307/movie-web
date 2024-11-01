/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@components": path.resolve(__dirname, "src/components"),
            "@libs": path.resolve(__dirname, "src/libs"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@context": path.resolve(__dirname, "src/context"),
        },
    },
});
