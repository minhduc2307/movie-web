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
            "@lib": path.resolve(__dirname, "src/lib"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@context": path.resolve(__dirname, "src/context"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@features": path.resolve(__dirname, "src/features"),
            "@services": path.resolve(__dirname, "src/services"),
        },
    },
    esbuild: {
        legalComments: "none",
    },
    build: {
        minify: "esbuild",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes("node_modules/@firebase/auth") ||
                        id.includes("node_modules/firebase/auth")
                    ) {
                        return "firebase-auth";
                    }
                    if (
                        id.includes("node_modules/@firebase/firestore") ||
                        id.includes("node_modules/firebase/firestore")
                    ) {
                        return "firebase-firestore";
                    }
                    if (
                        id.includes("node_modules/@firebase/database") ||
                        id.includes("node_modules/firebase/database")
                    ) {
                        return "firebase-database";
                    }
                    if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
                        return "firebase-core";
                    }
                    if (
                        id.includes("node_modules/react-dom") ||
                        id.includes("node_modules/react-router")
                    ) {
                        return "react-vendor";
                    }
                    if (
                        id.includes("node_modules/@radix-ui") ||
                        id.includes("node_modules/lucide-react") ||
                        id.includes("node_modules/sonner")
                    ) {
                        return "ui-vendor";
                    }
                },
            },
        },
    },
});
