import {
    browserLocalPersistence,
    connectAuthEmulator,
    getAuth,
    initializeAuth,
} from "firebase/auth";
import { firebaseApp } from "./app";

let authInstance = null;

/**
 * Returns the singleton Firebase Auth instance without popup/redirect resolvers
 * (email/password only), avoiding eager __/auth/iframe.js and gapi loads.
 */
export const getFirebaseAuth = () => {
    if (authInstance) return authInstance;

    try {
        authInstance = initializeAuth(firebaseApp, {
            persistence: browserLocalPersistence,
        });
    } catch {
        // Fallback if already initialized during Vite HMR
        authInstance = getAuth(firebaseApp);
    }

    if (
        import.meta.env.DEV &&
        import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true" &&
        !authInstance.emulatorConfig
    ) {
        connectAuthEmulator(authInstance, "http://127.0.0.1:9099", {
            disableWarnings: true,
        });
    }

    return authInstance;
};
