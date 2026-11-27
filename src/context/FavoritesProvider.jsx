import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
import i18n from "@/i18n";
import { useAuth } from "@context/AuthProvider";
import {
    addFavorite,
    getMovieId,
    migrateLocalFavoritesOnce,
    removeFavorite,
    subscribeFavorites,
    toFavoritePayload,
} from "@/services/firebase/favoritesService";

const FavoritesContext = createContext(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};

const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const uid = user?.uid || null;
    const email = user?.email || "";

    const [serverFavorites, setServerFavorites] = useState([]);
    const [optimisticOps, setOptimisticOps] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const inFlightIdsRef = useRef(new Set());
    const migratedUidsRef = useRef(new Set());
    const favoriteIdsRef = useRef(new Set());

    useEffect(() => {
        if (!uid) {
            setServerFavorites([]);
            setOptimisticOps({});
            setIsLoading(false);
            inFlightIdsRef.current.clear();
            return;
        }

        let cancelled = false;
        let unsubscribe = null;

        setIsLoading(true);

        subscribeFavorites(
            uid,
            (docs) => {
                if (cancelled) return;
                setServerFavorites(docs);
                setIsLoading(false);
            },
            (err) => {
                if (import.meta.env.DEV) {
                    console.error("[FavoritesProvider] Subscription failed:", err);
                }
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        )
            .then((unsub) => {
                if (cancelled) {
                    unsub?.();
                } else {
                    unsubscribe = unsub;
                }
            })
            .catch(() => {
                if (!cancelled) setIsLoading(false);
            });

        if (!migratedUidsRef.current.has(uid)) {
            migratedUidsRef.current.add(uid);
            migrateLocalFavoritesOnce(uid, email)
                .then((count) => {
                    if (!cancelled && count > 0) {
                        toast.success(i18n.t("favorites.migrated", { count }), {
                            id: "favorites-migrated",
                        });
                    }
                })
                .catch((err) => {
                    if (import.meta.env.DEV) {
                        console.warn("[FavoritesProvider] Migration skipped:", err);
                    }
                });
        }

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [uid, email]);

    const favorites = useMemo(() => {
        const pendingKeys = Object.keys(optimisticOps);
        if (pendingKeys.length === 0) return serverFavorites;

        const filtered = serverFavorites.filter(
            (item) => optimisticOps[item.movieId]?.action !== "remove"
        );
        const existingIds = new Set(filtered.map((item) => item.movieId));
        const additions = pendingKeys
            .filter(
                (id) =>
                    optimisticOps[id]?.action === "add" &&
                    optimisticOps[id]?.item &&
                    !existingIds.has(id)
            )
            .map((id) => optimisticOps[id].item);

        return [...additions, ...filtered];
    }, [serverFavorites, optimisticOps]);

    const favoriteIds = useMemo(() => {
        const set = new Set(favorites.map((item) => item.movieId));
        favoriteIdsRef.current = set;
        return set;
    }, [favorites]);

    const isFavorite = useCallback(
        (movieOrId) => {
            const id =
                typeof movieOrId === "string" ? movieOrId : getMovieId(movieOrId);
            return Boolean(id && favoriteIds.has(id));
        },
        [favoriteIds]
    );

    const clearOptimisticOp = useCallback((movieId) => {
        setOptimisticOps((prev) => {
            if (!prev[movieId]) return prev;
            const next = { ...prev };
            delete next[movieId];
            return next;
        });
    }, []);

    const toggleFavorite = useCallback(
        async (movieOrId) => {
            if (!uid) {
                toast.error(i18n.t("movie.loginRequiredFavorite"), {
                    id: "favorite-auth-required",
                });
                return false;
            }

            const movieId =
                typeof movieOrId === "string" ? movieOrId : getMovieId(movieOrId);
            if (!movieId || inFlightIdsRef.current.has(movieId)) {
                return false;
            }

            const currentlyFavorited = favoriteIdsRef.current.has(movieId);
            inFlightIdsRef.current.add(movieId);

            if (currentlyFavorited) {
                setOptimisticOps((prev) => ({
                    ...prev,
                    [movieId]: { action: "remove" },
                }));
            } else {
                const payload = toFavoritePayload(movieOrId, Date.now());
                const optimisticItem = {
                    ...payload,
                    id: movieId,
                    _id: movieId,
                    poster_url: payload.posterUrl,
                };
                setOptimisticOps((prev) => ({
                    ...prev,
                    [movieId]: { action: "add", item: optimisticItem },
                }));
            }

            try {
                if (currentlyFavorited) {
                    await removeFavorite(uid, movieId);
                    toast.success(i18n.t("movie.removedFavorite"), {
                        id: `fav-rm-${movieId}`,
                    });
                } else {
                    await addFavorite(uid, movieOrId);
                    toast.success(i18n.t("movie.addedFavorite"), {
                        id: `fav-add-${movieId}`,
                    });
                }
                return true;
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error("[FavoritesProvider] Toggle failed:", err);
                }
                toast.error(i18n.t("favorites.syncError"), { id: "favorites-sync-err" });
                return false;
            } finally {
                inFlightIdsRef.current.delete(movieId);
                clearOptimisticOp(movieId);
            }
        },
        [uid, clearOptimisticOp]
    );

    const value = useMemo(
        () => ({
            favorites,
            favoriteIds,
            isLoading,
            isFavorite,
            toggleFavorite,
        }),
        [favorites, favoriteIds, isLoading, isFavorite, toggleFavorite]
    );

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export default FavoritesProvider;
