import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAuth } from "@context/AuthProvider";
import { getMovieId } from "@/services/firebase/favoritesService";
import {
    clearAllWatchHistory,
    clearLocalHistory,
    migrateLocalHistoryOnce,
    readLocalHistory,
    removeLocalHistoryEntry,
    removeWatchHistory,
    saveLocalHistoryEntry,
    subscribeWatchHistory,
    toHistoryPayload,
    upsertWatchHistory,
} from "@/services/firebase/historyService";

const WatchHistoryContext = createContext(null);

export const useWatchHistory = () => {
    const context = useContext(WatchHistoryContext);
    if (!context) {
        throw new Error("useWatchHistory must be used within a WatchHistoryProvider");
    }
    return context;
};

const WatchHistoryProvider = ({ children }) => {
    const { user } = useAuth();
    const uid = user?.uid || null;

    const [cloudHistory, setCloudHistory] = useState([]);
    const [localHistory, setLocalHistory] = useState(() => readLocalHistory());
    const [isLoading, setIsLoading] = useState(false);
    const [cloudAvailable, setCloudAvailable] = useState(true);

    const migratedUidsRef = useRef(new Set());

    useEffect(() => {
        if (!uid) {
            setCloudHistory([]);
            setLocalHistory(readLocalHistory());
            setIsLoading(false);
            setCloudAvailable(true);
            return;
        }

        let cancelled = false;
        let unsubscribe = null;
        setCloudAvailable(true);
        setIsLoading(true);

        subscribeWatchHistory(
            uid,
            (docs) => {
                if (cancelled) return;
                setCloudHistory(docs);
                setIsLoading(false);
            },
            () => {
                if (cancelled) return;
                setCloudAvailable(false);
                setIsLoading(false);
            }
        )
            .then((unsub) => {
                if (cancelled) unsub?.();
                else unsubscribe = unsub;
            })
            .catch(() => {
                if (!cancelled) {
                    setCloudAvailable(false);
                    setIsLoading(false);
                }
            });

        if (!migratedUidsRef.current.has(uid)) {
            migratedUidsRef.current.add(uid);
            void migrateLocalHistoryOnce(uid).catch(() => {});
        }

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [uid]);

    const history = useMemo(
        () => (uid && cloudAvailable ? cloudHistory : localHistory),
        [uid, cloudAvailable, cloudHistory, localHistory]
    );

    const getMovieProgress = useCallback(
        (movieOrSlug) => {
            if (!movieOrSlug) return null;
            if (typeof movieOrSlug === "string") {
                return (
                    history.find(
                        (item) => item.slug === movieOrSlug || item.movieId === movieOrSlug
                    ) || null
                );
            }
            const id = getMovieId(movieOrSlug);
            const slug = movieOrSlug.slug;
            return (
                history.find(
                    (item) => (id && item.movieId === id) || (slug && item.slug === slug)
                ) || null
            );
        },
        [history]
    );

    const saveProgress = useCallback(
        async (entry) => {
            const payload = toHistoryPayload(entry, Date.now());
            if (!payload.movieId || !payload.slug) return;

            if (!uid || !cloudAvailable) {
                setLocalHistory(saveLocalHistoryEntry(entry));
                return;
            }

            setCloudHistory((prev) => {
                const filtered = prev.filter((item) => item.movieId !== payload.movieId);
                return [payload, ...filtered];
            });

            try {
                await upsertWatchHistory(uid, entry);
            } catch {
                setCloudAvailable(false);
                setLocalHistory(saveLocalHistoryEntry(entry));
            }
        },
        [uid, cloudAvailable]
    );

    const removeProgress = useCallback(
        async (movieId) => {
            if (!movieId) return;
            if (!uid || !cloudAvailable) {
                setLocalHistory(removeLocalHistoryEntry(movieId));
                return;
            }

            setCloudHistory((prev) => prev.filter((item) => item.movieId !== movieId));
            try {
                await removeWatchHistory(uid, movieId);
            } catch {
                setLocalHistory(removeLocalHistoryEntry(movieId));
            }
        },
        [uid, cloudAvailable]
    );

    const clearHistory = useCallback(async () => {
        if (!uid || !cloudAvailable) {
            setLocalHistory(clearLocalHistory());
            return;
        }

        setCloudHistory([]);
        try {
            await clearAllWatchHistory(uid);
        } catch {
            setLocalHistory(clearLocalHistory());
        }
    }, [uid, cloudAvailable]);

    const value = useMemo(
        () => ({
            history,
            isLoading,
            getMovieProgress,
            saveProgress,
            removeProgress,
            clearHistory,
        }),
        [history, isLoading, getMovieProgress, saveProgress, removeProgress, clearHistory]
    );

    return (
        <WatchHistoryContext.Provider value={value}>
            {children}
        </WatchHistoryContext.Provider>
    );
};

export default WatchHistoryProvider;
