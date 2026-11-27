import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Film } from "lucide-react";
import { useFavorites } from "@context/FavoritesProvider";
import { movieService } from "@/services/api";
import { extractYoutubeId } from "@lib/movieUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieHero from "./MovieHero";
import MovieInfoGrid from "./MovieInfoGrid";
import TrailerDialog from "./TrailerDialog";

const MovieDetail = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const [movieInfo, setMovieInfo] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setEpisodes([]);

        movieService
            .getMovieDetail(slug)
            .then((data) => {
                if (!isMounted) return;
                const movie = data?.movie || null;
                if (movie?.name) document.title = movie.name;
                setMovieInfo(movie);
                setEpisodes(data?.episodes || []);
            })
            .catch((err) => console.error("Error loading movie detail:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        window.scrollTo({ top: 0, behavior: "smooth" });
        return () => {
            isMounted = false;
        };
    }, [slug]);

    const isFavorited = isFavorite(movieInfo);

    const handleToggleFavorite = () => {
        if (!movieInfo) return;
        toggleFavorite(movieInfo);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <div className="w-full h-[460px] bg-muted/40 animate-pulse" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-44 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                    <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!movieInfo) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
                <Film className="h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-xl font-bold">{t("detail.notFound")}</h1>
                <Button asChild className="mt-4">
                    <Link to="/movies">{t("favorites.exploreNow")}</Link>
                </Button>
            </div>
        );
    }

    const trailerKey = extractYoutubeId(movieInfo.trailer_url);

    return (
        <div className="min-h-screen bg-background text-foreground pb-16">
            <MovieHero
                movieInfo={movieInfo}
                episodes={episodes}
                trailerKey={trailerKey}
                isFavorited={isFavorited}
                onToggleFavorite={handleToggleFavorite}
                onOpenTrailer={() => setIsTrailerOpen(true)}
            />
            <MovieInfoGrid movieInfo={movieInfo} />
            <TrailerDialog
                open={isTrailerOpen}
                onOpenChange={setIsTrailerOpen}
                movieName={movieInfo.name}
                trailerKey={trailerKey}
            />
        </div>
    );
};

export default MovieDetail;
