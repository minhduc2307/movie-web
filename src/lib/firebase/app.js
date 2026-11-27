import { getApp, getApps, initializeApp } from "firebase/app";

const REQUIRED_KEYS = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"];

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = REQUIRED_KEYS.filter((key) => !firebaseConfig[key]);
if (missingKeys.length > 0) {
    throw new Error(
        `Missing Firebase configuration (${missingKeys.join(", ")}). Check .env and .env.example.`
    );
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
