let dbPromise = null;

/**
 * Dynamically imports and initializes Cloud Firestore on demand so unauthenticated visitors
 * do not download firebase-core or Firestore SDKs on landing pages.
 */
export const getDb = () => {
    if (!dbPromise) {
        dbPromise = Promise.all([
            import("./app"),
            import("firebase/firestore"),
        ]).then(([{ firebaseApp }, { getFirestore, connectFirestoreEmulator }]) => {
            const db = getFirestore(firebaseApp);
            if (
                import.meta.env.DEV &&
                import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true"
            ) {
                connectFirestoreEmulator(db, "127.0.0.1", 8080);
            }
            return db;
        });
    }
    return dbPromise;
};
