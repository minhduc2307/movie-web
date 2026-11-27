import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Trash2, Film } from "lucide-react";
import MovieCard from "@components/MediaList/MovieCard";
import MovieCardSkeleton from "@components/MediaList/MovieCardSkeleton";
import { useFavorites } from "@context/FavoritesProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SKELETON_COUNT = 12;

const FavoriteList = () => {
    const { t } = useTranslation();
    const { favorites: movieList, isLoading, toggleFavorite } = useFavorites();

    useEffect(() => {
        document.title = `${t("favorites.title")} — ${t("brand.name")}`;
    }, [t]);

    const count = movieList.length;

    return (
        <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
            <div className="app-container">
                <div className="mb-8 flex items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-rose-400">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {t("favorites.title")}
                            </h1>
                        </div>
                    </div>
                    {!isLoading && count > 0 && (
                        <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                            {t("catalog.totalResults", { count })}
                        </Badge>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
                        {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                            <MovieCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : count === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
                            <Film className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                            {t("favorites.emptyTitle")}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            {t("favorites.emptyDesc")}
                        </p>
                        <Button asChild className="mt-6">
                            <Link to="/movies">{t("favorites.exploreNow")}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
                        {movieList.map((movie) => (
                            <div
                                key={movie.movieId || movie._id || movie.id}
                                className="group/item relative"
                            >
                                <MovieCard
                                    name={movie.name}
                                    posterUrl={movie.poster_url || movie.posterUrl}
                                    year={movie.year}
                                    time={movie.time}
                                    type={movie.type}
                                    slug={movie.slug}
                                    category={movie.category}
                                    quality={movie.quality}
                                    reserveTopRight
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2 z-20 h-11 w-11 sm:h-8 sm:w-8 rounded-full opacity-95 shadow-lg transition-transform hover:scale-110 group-hover/item:opacity-100"
                                    onClick={() => toggleFavorite(movie)}
                                    title={t("movie.removeFavorite")}
                                    aria-label={t("movie.removeFavorite")}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoriteList;
