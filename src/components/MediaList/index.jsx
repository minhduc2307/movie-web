import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { HOME_SECTION_LIMIT } from "@/lib/constants";
import { queryKeys } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import MovieCarouselRow from "@components/common/MovieCarouselRow";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { movieService } from "@/services/api";

const CAROUSEL_ITEM_CLASS =
    "w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-[22.5vw] lg:w-[19vw] xl:w-[15.7%]";

const MediaList = ({ tab, deferLoad = false }) => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [shouldFetch, setShouldFetch] = useState(!deferLoad);
    const typeSlug = tab?.typeSlug;

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

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: queryKeys.byType(typeSlug, { limit: HOME_SECTION_LIMIT }),
        queryFn: ({ signal }) =>
            movieService.getMoviesByType(typeSlug, { limit: HOME_SECTION_LIMIT }, signal),
        enabled: Boolean(shouldFetch && typeSlug),
    });

    const mediaList = data?.items || [];
    const showSkeleton = !shouldFetch || isLoading;
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

            {isError ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/70 bg-muted/30 px-4 py-8 text-center">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("common.loadSectionError")}</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>{t("watch.player.retry")}</span>
                    </Button>
                </div>
            ) : (
                <MovieCarouselRow>
                    {showSkeleton
                        ? Array.from({ length: HOME_SECTION_LIMIT }).map((_, index) => (
                              <div key={index} className={CAROUSEL_ITEM_CLASS}>
                                  <MovieCardSkeleton />
                              </div>
                          ))
                        : mediaList.map((media) => (
                              <div key={media._id || media.id} className={CAROUSEL_ITEM_CLASS}>
                                  <MovieCard
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
                              </div>
                          ))}
                </MovieCarouselRow>
            )}
        </section>
    );
};

export default MediaList;
