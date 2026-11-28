import { getDb } from "@/lib/firebase/firestore";
import { normalizeImageUrl } from "@/services/api/dto";
import { getMovieId } from "./favoritesService";

const LOCAL_HISTORY_KEY = "motphim_watch_history";
const MIGRATION_KEY_PREFIX = "history_migrated_";
const MAX_LOCAL_HISTORY = 20;
const MAX_CLOUD_HISTORY = 30;
const BATCH_CHUNK_SIZE = 450;

export const toHistoryPayload = (entry, updatedAtValue) => {
    const movie = entry?.movie || entry || {};
    const movieId = getMovieId(movie) || String(entry?.slug || "").trim();
    const posterUrl = normalizeImageUrl(movie.posterUrl || movie.poster_url || entry?.posterUrl);
    const thumbUrl = normalizeImageUrl(
        movie.thumbUrl || movie.thumb_url || entry?.thumbUrl || posterUrl
    );
    const numericYear = Number(movie.year ?? entry?.year);
    const safeCurrent = Math.max(0, Math.floor(Number(entry?.currentTime) || 0));
    const safeDuration = Math.max(0, Math.floor(Number(entry?.duration) || 0));

    return {
        movieId,
        slug: String(movie.slug || entry?.slug || "").trim().slice(0, 200),
        name: String(movie.name || entry?.name || "Untitled").trim().slice(0, 300),
        originName: String(movie.originName || movie.origin_name || entry?.originName || "")
            .trim()
            .slice(0, 300),
        posterUrl: String(posterUrl || "/NoImage.svg").slice(0, 500),
        thumbUrl: String(thumbUrl || "/NoImage.svg").slice(0, 500),
        year: Number.isFinite(numericYear) && numericYear > 0 ? numericYear : null,
        type: String(movie.type || entry?.type || "single").trim().slice(0, 50),
        quality: String(movie.quality || entry?.quality || "").trim().slice(0, 50),
        serverIdx: Math.max(0, Math.floor(Number(entry?.serverIdx) || 0)),
        episodeIndex: Math.max(0, Math.floor(Number(entry?.episodeIndex) || 0)),
        episodeName: String(entry?.episodeName || "").trim().slice(0, 100),
        currentTime: safeCurrent,
        duration: safeDuration,
        updatedAt: updatedAtValue,
    };
};

const fromHistoryDoc = (docSnap) => {
    const data = docSnap.data() || {};
    const movieId = data.movieId || docSnap.id;
    const updatedAtMs =
        typeof data.updatedAt?.toMillis === "function"
            ? data.updatedAt.toMillis()
            : Number(data.updatedAt) || 0;

    return {
        ...data,
        movieId,
        id: movieId,
        _id: movieId,
        posterUrl: data.posterUrl || "/NoImage.svg",
        poster_url: data.posterUrl || "/NoImage.svg",
        thumbUrl: data.thumbUrl || data.posterUrl || "/NoImage.svg",
        updatedAtMs,
    };
};

export const readLocalHistory = () => {
    try {
        const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((item) => item?.movieId && item?.slug)
            .sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0))
            .slice(0, MAX_LOCAL_HISTORY);
    } catch {
        return [];
    }
};

export const writeLocalHistory = (items) => {
    try {
        localStorage.setItem(
            LOCAL_HISTORY_KEY,
            JSON.stringify(items.slice(0, MAX_LOCAL_HISTORY))
        );
    } catch {
        // Ignore quota / private mode errors
    }
};

export const saveLocalHistoryEntry = (entry) => {
    const payload = toHistoryPayload(entry, Date.now());
    if (!payload.movieId || !payload.slug) return readLocalHistory();
    const current = readLocalHistory().filter(
        (item) => item.movieId !== payload.movieId && item.slug !== payload.slug
    );
    const next = [payload, ...current].slice(0, MAX_LOCAL_HISTORY);
    writeLocalHistory(next);
    return next;
};

export const removeLocalHistoryEntry = (movieId) => {
    const next = readLocalHistory().filter((item) => item.movieId !== movieId);
    writeLocalHistory(next);
    return next;
};

export const clearLocalHistory = () => {
    try {
        localStorage.removeItem(LOCAL_HISTORY_KEY);
    } catch {
        // Ignore storage errors
    }
    return [];
};

export const subscribeWatchHistory = async (uid, onData, onError) => {
    const [db, { collection, limit, onSnapshot, orderBy, query }] =
        await Promise.all([getDb(), import("firebase/firestore")]);

    const historyRef = collection(db, "users", uid, "history");
    const q = query(historyRef, orderBy("updatedAt", "desc"), limit(MAX_CLOUD_HISTORY));

    return onSnapshot(
        q,
        (snapshot) => {
            onData(snapshot.docs.map(fromHistoryDoc));
        },
        (error) => {
            onError?.(error);
        }
    );
};

export const upsertWatchHistory = async (uid, entry) => {
    const payload = toHistoryPayload(entry, Date.now());
    if (!payload.movieId || !payload.slug) return;

    const [db, { doc, serverTimestamp, setDoc }] = await Promise.all([
        getDb(),
        import("firebase/firestore"),
    ]);

    const docRef = doc(db, "users", uid, "history", payload.movieId);
    await setDoc(docRef, toHistoryPayload(entry, serverTimestamp()), { merge: true });
};

export const removeWatchHistory = async (uid, movieId) => {
    const safeId = String(movieId || "").trim();
    if (!safeId) return;

    const [db, { deleteDoc, doc }] = await Promise.all([
        getDb(),
        import("firebase/firestore"),
    ]);

    await deleteDoc(doc(db, "users", uid, "history", safeId));
};

export const clearAllWatchHistory = async (uid) => {
    const [db, { collection, getDocs, writeBatch }] = await Promise.all([
        getDb(),
        import("firebase/firestore"),
    ]);

    const snap = await getDocs(collection(db, "users", uid, "history"));
    for (let i = 0; i < snap.docs.length; i += BATCH_CHUNK_SIZE) {
        const chunk = snap.docs.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = writeBatch(db);
        chunk.forEach((docSnap) => batch.delete(docSnap.ref));
        await batch.commit();
    }
};

export const migrateLocalHistoryOnce = async (uid) => {
    const migratedKey = `${MIGRATION_KEY_PREFIX}${uid}`;
    try {
        if (localStorage.getItem(migratedKey) === "1") return 0;
    } catch {
        return 0;
    }

    const items = readLocalHistory();
    const cleanupStorage = () => {
        try {
            localStorage.removeItem(LOCAL_HISTORY_KEY);
            localStorage.setItem(migratedKey, "1");
        } catch {
            // Ignore storage errors
        }
    };

    if (items.length === 0) {
        cleanupStorage();
        return 0;
    }

    const [db, { collection, doc, getDocs, serverTimestamp, writeBatch }] =
        await Promise.all([getDb(), import("firebase/firestore")]);

    const historyRef = collection(db, "users", uid, "history");
    const existingSnap = await getDocs(historyRef);
    const existingIds = new Set(existingSnap.docs.map((d) => d.id));

    const toInsert = items.filter((item) => !existingIds.has(item.movieId));
    for (let i = 0; i < toInsert.length; i += BATCH_CHUNK_SIZE) {
        const chunk = toInsert.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = writeBatch(db);
        for (const item of chunk) {
            const docRef = doc(db, "users", uid, "history", item.movieId);
            batch.set(docRef, toHistoryPayload(item, serverTimestamp()));
        }
        await batch.commit();
    }

    cleanupStorage();
    return toInsert.length;
};
