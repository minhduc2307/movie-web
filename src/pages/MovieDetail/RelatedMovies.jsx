import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { movieService } from "@/services/api";
import { queryKeys } from "@/lib/queryClient";
import MovieCard from "@components/MediaList/MovieCard";
import MovieCardSkeleton from "@components/MediaList/MovieCardSkeleton";
import MovieCarouselRow from "@components/common/MovieCarouselRow";

const RELATED_LIMIT = 12;

const RelatedMovies = ({ categories = [], currentMovieId, currentSlug }) => {
    const { t } = useTranslation();
    const primarySlug = categories?.[0]?.slug || "";

    const { data, isLoading } = useQuery({
        queryKey: queryKeys.byCategory(primarySlug, { limit: RELATED_LIMIT }),
        queryFn: () => movieService.getMoviesByCategory(primarySlug, { limit: RELATED_LIMIT }),
        enabled: Boolean(primarySlug),
    });

    const related = (data?.items || []).filter(
        (item) =>
            (item._id || item.id) !== currentMovieId &&
            item.slug !== currentSlug
    );

    if (!primarySlug || (!isLoading && related.length === 0)) {
        return null;
    }

    return (
        <section className="app-container mt-10 cv-auto">
            <div className="mb-4 sm:mb-5 flex items-center">
                <span className="mr-3 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-primary to-amber-500" />
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    <Sparkles className="h-5 w-5 text-primary dark:text-rose-400" />
                    <span>{t("detail.relatedTitle")}</span>
                </h2>
            </div>

            <MovieCarouselRow>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                          <div
                              key={idx}
                              className="w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-[22.5vw] lg:w-[19vw] xl:w-[15.7%]"
                          >
                              <MovieCardSkeleton />
                          </div>
                      ))
                    : related.map((media) => (
                          <div
                              key={media._id || media.id || media.slug}
                              className="w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-[22.5vw] lg:w-[19vw] xl:w-[15.7%]"
                          >
                              <MovieCard
                                  name={media.name}
                                  posterUrl={media.posterUrl || media.poster_url}
                                  year={media.year}
                                  time={media.time}
                                  type={media.type}
                                  slug={media.slug}
                                  category={media.category}
                                  quality={media.quality}
                                  episodeCurrent={media.episodeCurrent || media.episode_current}
                              />
                          </div>
                      ))}
            </MovieCarouselRow>
        </section>
    );
};

export default RelatedMovies;
