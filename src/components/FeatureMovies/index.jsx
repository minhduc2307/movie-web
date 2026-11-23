import { useEffect, useState } from "react";
import Movie from "./Movie";
import HeroSkeleton from "./HeroSkeleton";
import { movieService } from "@/services/api";

const FeatureMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchSpotlight = async () => {
            try {
                // Try v1 first for rich metadata (quality, category, etc.)
                const res = await movieService.getNewUpdatedMovies(1, "v1");
                if (isMounted && res.items && res.items.length > 0) {
                    setMovies(res.items.slice(0, 8));
                    return;
                }
            } catch {
                // Fallback to legacy
                try {
                    const legacyRes = await movieService.getNewUpdatedMovies(1, "legacy");
                    if (isMounted) {
                        setMovies((legacyRes.items || []).slice(0, 8));
                    }
                } catch (legacyErr) {
                    console.error("Error fetching feature movies:", legacyErr);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchSpotlight();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return <HeroSkeleton />;
    }

    if (!movies || movies.length === 0) {
        return null;
    }

    return <Movie movies={movies} />;
};

export default FeatureMovies;
