import MovieCard from "@components/MediaList/MovieCard";
import { useUserContext } from "@context/UserProvider";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Film } from "lucide-react";
import { Link } from "react-router-dom";

const FavoriteList = () => {
    const { t } = useTranslation();
    const { favoriteList: movieList, setFavoriteList } = useUserContext();

    const deleteFavoriteMovie = (id) => {
        const updatedMediaList = (movieList || []).filter((movie) => {
            return (movie._id || movie.id) !== id;
        });
        setFavoriteList(updatedMediaList);
        toast.success(t("movie.removedFavorite"));
    };

    const count = (movieList || []).length;

    return (
        <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Heart className="h-5 w-5 fill-primary text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {t("favorites.title")}
                            </h1>
                        </div>
                    </div>
                    {count > 0 && (
                        <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                            {t("catalog.totalResults", { count })}
                        </Badge>
                    )}
                </div>

                {count === 0 ? (
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {(movieList || []).map((movie) => (
                            <div
                                key={movie._id || movie.id}
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
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full opacity-90 shadow-lg transition-transform hover:scale-110 group-hover/item:opacity-100"
                                    onClick={() => {
                                        deleteFavoriteMovie(movie._id || movie.id);
                                    }}
                                    title="Xóa khỏi danh sách yêu thích"
                                    aria-label="Xóa khỏi danh sách yêu thích"
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
