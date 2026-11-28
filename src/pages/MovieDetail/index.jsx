import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Film, RefreshCw } from "lucide-react";
import { useFavorites } from "@context/FavoritesProvider";
import { useWatchHistory } from "@context/WatchHistoryProvider";
import { movieService } from "@/services/api";
import { queryKeys } from "@/lib/queryClient";
import { extractYoutubeId } from "@lib/movieUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieHero from "./MovieHero";
import MovieInfoGrid from "./MovieInfoGrid";
import RelatedMovies from "./RelatedMovies";
import TrailerDialog from "./TrailerDialog";

const MovieDetail = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { getMovieProgress } = useWatchHistory();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: queryKeys.detail(slug),
        queryFn: () => movieService.getMovieDetail(slug),
        enabled: Boolean(slug),
    });

    const movieInfo = data?.movie || null;
    const episodes = data?.episodes || [];

    useEffect(() => {
        if (movieInfo?.name) {
            document.title = movieInfo.name;
        }
    }, [movieInfo?.name]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug]);

    const isFavorited = isFavorite(movieInfo);
    const savedProgress = getMovieProgress(movieInfo || slug);

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

    if (isError) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
                <Film className="h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-xl font-bold">{t("common.loadSectionError")}</h1>
                <Button type="button" onClick={() => refetch()} className="mt-4 gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>{t("watch.player.retry")}</span>
                </Button>
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
                savedProgress={savedProgress}
                isFavorited={isFavorited}
                onToggleFavorite={handleToggleFavorite}
                onOpenTrailer={() => setIsTrailerOpen(true)}
            />
            <MovieInfoGrid movieInfo={movieInfo} />
            <RelatedMovies
                categories={movieInfo.category}
                currentMovieId={movieInfo._id}
                currentSlug={movieInfo.slug}
            />
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
