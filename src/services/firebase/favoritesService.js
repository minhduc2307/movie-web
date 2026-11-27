import { getDb } from "@/lib/firebase/firestore";
import { normalizeImageUrl } from "@/services/api/dto";

const MIGRATION_KEY_PREFIX = "favorites_migrated_";
const BATCH_CHUNK_SIZE = 450;

const sanitizeCategories = (categories) => {
    if (!Array.isArray(categories)) return [];
    return categories
        .slice(0, 5)
        .map((cat) => ({
            name: String(cat?.name || "").trim(),
            slug: String(cat?.slug || "").trim(),
        }))
        .filter((cat) => cat.name.length > 0);
};

export const getMovieId = (movie) => {
    if (!movie) return "";
    return String(movie.movieId || movie._id || movie.id || "").trim();
};

export const toFavoritePayload = (movie, addedAtValue) => {
    const movieId = getMovieId(movie);
    const posterUrl = normalizeImageUrl(movie.posterUrl || movie.poster_url);
    const numericYear = Number(movie.year);

    return {
        movieId,
        slug: String(movie.slug || "").trim().slice(0, 200),
        name: String(movie.name || "Untitled").trim().slice(0, 300),
        originName: String(movie.originName || movie.origin_name || "")
            .trim()
            .slice(0, 300),
        posterUrl: String(posterUrl || "/NoImage.svg").slice(0, 500),
        year: Number.isFinite(numericYear) && numericYear > 0 ? numericYear : null,
        time: String(movie.time || "").trim(),
        type: String(movie.type || "single").trim(),
        quality: String(movie.quality || "").trim(),
        category: sanitizeCategories(movie.category),
        addedAt: addedAtValue,
    };
};

const fromFavoriteDoc = (docSnap) => {
    const data = docSnap.data() || {};
    const movieId = data.movieId || docSnap.id;
    return {
        ...data,
        movieId,
        id: movieId,
        _id: movieId,
        posterUrl: data.posterUrl || "/NoImage.svg",
        poster_url: data.posterUrl || "/NoImage.svg",
    };
};

export const subscribeFavorites = async (uid, onData, onError) => {
    const [db, { collection, onSnapshot, orderBy, query }] = await Promise.all([
        getDb(),
        import("firebase/firestore"),
    ]);

    const favRef = collection(db, "users", uid, "favorites");
    const q = query(favRef, orderBy("addedAt", "desc"));

    return onSnapshot(
        q,
        (snapshot) => {
            onData(snapshot.docs.map(fromFavoriteDoc));
        },
        (error) => {
            onError?.(error);
        }
    );
};

export const addFavorite = async (uid, movie) => {
    const movieId = getMovieId(movie);
    if (!movieId) throw new Error("Invalid movieId");

    const [db, { doc, serverTimestamp, setDoc }] = await Promise.all([
        getDb(),
        import("firebase/firestore"),
    ]);

    const docRef = doc(db, "users", uid, "favorites", movieId);
    await setDoc(docRef, toFavoritePayload(movie, serverTimestamp()));
};

export const removeFavorite = async (uid, movieId) => {
    const safeId = String(movieId || "").trim();
    if (!safeId) throw new Error("Invalid movieId");

    const [db, { deleteDoc, doc }] = await Promise.all([
        getDb(),
        import("firebase/firestore"),
    ]);

    await deleteDoc(doc(db, "users", uid, "favorites", safeId));
};

const readLegacyFavorites = (email) => {
    const sources = [];
    if (email) sources.push(`user_favorites_${email}`);
    sources.push("favoriteList");

    const byId = new Map();
    for (const key of sources) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) continue;
            for (const item of parsed) {
                const id = getMovieId(item);
                if (id && item?.slug && !byId.has(id)) {
                    byId.set(id, item);
                }
            }
        } catch {
            // Ignore malformed localStorage entries
        }
    }
    return { items: Array.from(byId.values()), keys: sources };
};

export const migrateLocalFavoritesOnce = async (uid, email) => {
    const migratedKey = `${MIGRATION_KEY_PREFIX}${uid}`;
    try {
        if (localStorage.getItem(migratedKey) === "1") return 0;
    } catch {
        return 0;
    }

    const { items, keys } = readLegacyFavorites(email);
    const cleanupStorage = () => {
        try {
            keys.forEach((k) => localStorage.removeItem(k));
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

    const favRef = collection(db, "users", uid, "favorites");
    const existingSnap = await getDocs(favRef);
    const existingIds = new Set(existingSnap.docs.map((d) => d.id));

    const toInsert = items.filter((item) => !existingIds.has(getMovieId(item)));
    for (let i = 0; i < toInsert.length; i += BATCH_CHUNK_SIZE) {
        const chunk = toInsert.slice(i, i + BATCH_CHUNK_SIZE);
        const batch = writeBatch(db);
        for (const movie of chunk) {
            const id = getMovieId(movie);
            const docRef = doc(db, "users", uid, "favorites", id);
            batch.set(docRef, toFavoritePayload(movie, serverTimestamp()));
        }
        await batch.commit();
    }

    cleanupStorage();
    return toInsert.length;
};
