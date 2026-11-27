import { getAuth, connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "./app";

let authInstance = null;

/**
 * Returns the singleton Firebase Auth instance, lazily attaching the local emulator in emulator mode.
 */
export const getFirebaseAuth = () => {
    if (authInstance) return authInstance;

    authInstance = getAuth(firebaseApp);

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
