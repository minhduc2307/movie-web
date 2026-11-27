import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";

const AUTH_ERROR_KEY_MAP = {
    "auth/invalid-credential": "auth.errors.invalidCredential",
    "auth/wrong-password": "auth.errors.invalidCredential",
    "auth/user-not-found": "auth.errors.invalidCredential",
    "auth/invalid-email": "auth.errors.invalidEmail",
    "auth/email-already-in-use": "auth.errors.emailInUse",
    "auth/weak-password": "auth.errors.weakPassword",
    "auth/too-many-requests": "auth.errors.tooManyRequests",
    "auth/network-request-failed": "auth.errors.network",
    "auth/user-disabled": "auth.errors.userDisabled",
};

const profileListeners = new Set();

export const normalizeAuthUser = (firebaseUser) => {
    if (!firebaseUser) return null;
    const emailFallback = firebaseUser.email?.split("@")?.[0] || "User";
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName?.trim() || emailFallback,
        photoURL: firebaseUser.photoURL || "",
    };
};

export const subscribeToAuthState = (callback) => {
    const auth = getFirebaseAuth();

    const notify = (firebaseUser) => {
        callback(normalizeAuthUser(firebaseUser));
    };

    profileListeners.add(notify);
    const unsubscribeFirebase = onAuthStateChanged(auth, notify);

    return () => {
        profileListeners.delete(notify);
        unsubscribeFirebase();
    };
};

export const signUpWithEmail = async ({ displayName, email, password }) => {
    const auth = getFirebaseAuth();
    const cleanName = displayName.trim();
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

    if (cleanName) {
        await updateProfile(credential.user, { displayName: cleanName });
        // onAuthStateChanged does not re-fire after updateProfile, so push updated profile manually
        profileListeners.forEach((listener) => listener(credential.user));
    }

    return normalizeAuthUser(credential.user);
};

export const signInWithEmail = async ({ email, password }) => {
    const auth = getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return normalizeAuthUser(credential.user);
};

export const signOutUser = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
};

export const mapAuthErrorToKey = (error) => {
    const code = error?.code;
    return AUTH_ERROR_KEY_MAP[code] || "auth.errors.unknown";
};
