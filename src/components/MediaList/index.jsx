import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { movieService } from "@/services/api";

const MediaList = ({ tab }) => {
    const { t } = useTranslation();
    const [mediaList, setMediaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const typeSlug = tab?.typeSlug;
        if (!typeSlug) return;

        setIsLoading(true);
        movieService
            .getMoviesByType(typeSlug, { limit: 6 })
            .then((res) => {
                if (isMounted) {
                    setMediaList(res.items || []);
                }
            })
            .catch((err) => {
                console.error(`Error loading media list (${typeSlug}):`, err);
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [tab?.typeSlug]);

    const sectionTitle = tab?.titleKey ? t(tab.titleKey) : tab?.title;
    const viewAllLink = tab?.typeSlug ? `/movies?type=${tab.typeSlug}` : "/movies";

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-primary to-amber-500 rounded-full mr-3 shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {sectionTitle}
                    </h2>
                </div>

                <Link
                    to={viewAllLink}
                    className="group flex items-center gap-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <span>{t("movie.viewAll")}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <MovieCardSkeleton key={index} />
                    ))
                ) : (
                    mediaList.map((media) => (
                        <MovieCard
                            key={media._id || media.id}
                            name={media.name}
                            posterUrl={media.posterUrl || media.poster_url}
                            year={media.year}
                            time={media.time}
                            type={media.type}
                            slug={media.slug}
                            category={media.category}
                            quality={media.quality || "FHD"}
                            episodeCurrent={media.episodeCurrent || media.episode_current}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default MediaList;
