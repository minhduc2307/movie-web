import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { HOME_SECTION_LIMIT } from "@/lib/constants";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { movieService } from "@/services/api";

const MediaList = ({ tab, deferLoad = false }) => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [shouldFetch, setShouldFetch] = useState(!deferLoad);
    const [mediaList, setMediaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!deferLoad || shouldFetch) return;
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setShouldFetch(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShouldFetch(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "350px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [deferLoad, shouldFetch]);

    useEffect(() => {
        if (!shouldFetch) return;
        let isMounted = true;
        const typeSlug = tab?.typeSlug;
        if (!typeSlug) return;

        setIsLoading(true);
        movieService
            .getMoviesByType(typeSlug, { limit: HOME_SECTION_LIMIT })
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
    }, [tab?.typeSlug, shouldFetch]);

    const sectionTitle = tab?.titleKey ? t(tab.titleKey) : tab?.title;
    const viewAllLink = tab?.typeSlug ? `/movies?type=${tab.typeSlug}` : "/movies";

    return (
        <section ref={sectionRef} className="w-full cv-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-primary to-amber-500 rounded-full mr-3 shrink-0" />
                    <h2 className="text-xl sm:text-2xl min-[2000px]:text-3xl font-bold tracking-tight text-foreground">
                        {sectionTitle}
                    </h2>
                </div>

                <Link
                    to={viewAllLink}
                    className="group flex items-center gap-1 py-2 text-xs sm:text-sm min-[2000px]:text-base font-medium text-muted-foreground hover:text-primary dark:hover:text-rose-400 transition-colors"
                >
                    <span>{t("movie.viewAll")}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 min-[2000px]:gap-5">
                {isLoading ? (
                    Array.from({ length: HOME_SECTION_LIMIT }).map((_, index) => (
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
