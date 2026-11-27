import { firebaseApp } from "./app";

let rtdbPromise = null;

/**
 * Dynamically imports and initializes Realtime Database on demand so non-room routes
 * never include the RTDB SDK in the initial bundle.
 */
export const getRtdb = () => {
    if (!rtdbPromise) {
        rtdbPromise = import("firebase/database").then(
            ({ getDatabase, connectDatabaseEmulator }) => {
                const db = getDatabase(firebaseApp);
                if (
                    import.meta.env.DEV &&
                    import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true"
                ) {
                    connectDatabaseEmulator(db, "127.0.0.1", 9000);
                }
                return db;
            }
        );
    }
    return rtdbPromise;
};
