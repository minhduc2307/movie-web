import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeImageUrl, movieService } from "@/services/api";
import { localizeMovieMetaText } from "@lib/movieUtils";
import { cn } from "@/lib/utils";
import HeroSlideContent from "./HeroSlideContent";

const AUTO_PLAY_INTERVAL = 5500;

const Movie = ({ movies = [] }) => {
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [resetTimer, setResetTimer] = useState(0);
    const [movieDetails, setMovieDetails] = useState({});
    const movieDetailsRef = useRef({});
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const count = movies.length;

    const nextSlide = useCallback(() => {
        if (count === 0) return;
        setCurrentIndex((prev) => (prev + 1) % count);
        setResetTimer((t) => t + 1);
    }, [count]);

    const prevSlide = useCallback(() => {
        if (count === 0) return;
        setCurrentIndex((prev) => (prev - 1 + count) % count);
        setResetTimer((t) => t + 1);
    }, [count]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setResetTimer((t) => t + 1);
    };

    // Autoplay timer with clean reset on manual slide change
    useEffect(() => {
        if (count <= 1 || isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % count);
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(timer);
    }, [count, isHovered, resetTimer]);

    // Asynchronously enrich active movie details (synopsis, accurate rating, category)
    useEffect(() => {
        const activeMovie = movies[currentIndex];
        if (!activeMovie?.slug) return;
        if (movieDetailsRef.current[activeMovie.slug] || activeMovie.content) return;

        let isCancelled = false;
        movieService
            .getMovieDetail(activeMovie.slug)
            .then((res) => {
                if (!isCancelled && res?.movie?.content) {
                    const detailEntry = {
                        content: res.movie.content,
                        rating: res.movie.rating || activeMovie.rating,
                        category: res.movie.category || activeMovie.category,
                    };
                    movieDetailsRef.current = {
                        ...movieDetailsRef.current,
                        [activeMovie.slug]: detailEntry,
                    };
                    setMovieDetails(movieDetailsRef.current);
                }
            })
            .catch(() => {
                // Silently fallback to item metadata
            });

        return () => {
            isCancelled = true;
        };
    }, [currentIndex, movies]);

    if (!movies || count === 0) {
        return null;
    }

    const currentMovie = movies[currentIndex] || movies[0];
    const activeDetail = movieDetails[currentMovie.slug];

    const rawCategoryName =
        (Array.isArray(activeDetail?.category) && activeDetail.category[0]?.name) ||
        (Array.isArray(currentMovie.category) && currentMovie.category[0]?.name) ||
        (typeof currentMovie.category === "string" ? currentMovie.category : null) ||
        (currentMovie.type === "series"
            ? t("movie.series")
            : currentMovie.type === "hoathinh"
            ? t("movie.anime")
            : t("movie.single"));
    const categoryName = localizeMovieMetaText(rawCategoryName, i18n.language);

    const rawRating =
        activeDetail?.rating ||
        currentMovie.rating ||
        currentMovie.tmdb?.vote_average ||
        currentMovie.vote_average;
    const rating = rawRating && Number(rawRating) > 0 ? Number(rawRating).toFixed(1) : "8.6";

    const rawContent = activeDetail?.content || currentMovie.content || currentMovie.description;
    const cleanDescription = rawContent
        ? rawContent.replace(/<[^>]*>/g, "").trim()
        : t("hero.fallbackDesc", {
              name: currentMovie.name,
              subtitle: currentMovie.originName || currentMovie.year || "",
              genre: categoryName || t("genres.featured"),
              quality: currentMovie.quality || "FHD",
          });

    const handleTouchStart = (e) => {
        if (e.touches && e.touches[0]) {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchEnd = (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const diffX = touchStartX.current - e.changedTouches[0].clientX;
        const diffY = touchStartY.current - e.changedTouches[0].clientY;
        // Only trigger horizontal swipe if horizontal displacement dominates vertical scrolling
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX > 0) nextSlide();
            else prevSlide();
        }
    };

    return (
        <div className="px-4 pt-3 sm:p-0 bg-background">
            <section
                className="group/hero relative w-full aspect-[3/4] max-h-[540px] sm:aspect-auto sm:max-h-none sm:h-[580px] lg:h-[72vh] lg:min-h-[580px] lg:max-h-[760px] 2xl:max-h-[840px] overflow-hidden rounded-2xl sm:rounded-none border border-white/10 sm:border-none shadow-2xl sm:shadow-none bg-[#0b0f19] select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-label={t("hero.sectionLabel")}
            >
                {/* Backdrop Slides Container */}
                <div className="absolute inset-0">
                    {movies.map((movie, index) => {
                        const isCurrent = index === currentIndex;
                        const desktopBackdrop = normalizeImageUrl(
                            movie.thumbUrl || movie.thumb_url || movie.posterUrl || movie.poster_url
                        );
                        const mobilePoster = normalizeImageUrl(
                            movie.posterUrl || movie.poster_url || movie.thumbUrl || movie.thumb_url
                        );

                        return (
                            <div
                                key={movie._id || movie.id || index}
                                className={cn(
                                    "absolute inset-0 transition-opacity duration-700 ease-in-out",
                                    isCurrent ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
                                )}
                            >
                                <picture className="block h-full w-full">
                                    <source media="(min-width: 640px)" srcSet={desktopBackdrop} />
                                    <img
                                        src={mobilePoster}
                                        alt={movie.name || "Backdrop"}
                                        className={cn(
                                            "h-full w-full object-cover object-top sm:object-[center_25%] transition-transform duration-1000 ease-out",
                                            isCurrent ? "scale-105" : "scale-100"
                                        )}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        onError={(e) => {
                                            if (e.target && !e.target.src.endsWith("/NoImage.svg")) {
                                                e.target.src = "/NoImage.svg";
                                            }
                                        }}
                                    />
                                </picture>
                            </div>
                        );
                    })}
                </div>

            {/* Vignette Overlays: Always dark cinematic gradients so white text stays crisp in both Light & Dark Mode */}
            {/* 1. Bottom-to-top gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none z-10" />

            {/* 2. Left-to-right gradient for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent pointer-events-none z-10 w-full sm:w-4/5 lg:w-3/5" />

            {/* 3. Top subtle vignette */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0b0f19]/75 to-transparent pointer-events-none z-10" />

            {/* Hero Spotlight Info Content with safe side clearance for nav chevrons */}
            <div className="app-container relative z-20 flex h-full flex-col justify-end pb-16 sm:px-20 lg:px-20 2xl:px-24">
                <HeroSlideContent
                    key={currentIndex}
                    movie={currentMovie}
                    categoryName={categoryName}
                    rating={rating}
                    cleanDescription={cleanDescription}
                />
            </div>

            {/* Slider Navigation Chevrons */}
            <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-12 w-12 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover/hero:opacity-100 focus-visible:opacity-100"
                aria-label={t("hero.prev")}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-12 w-12 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover/hero:opacity-100 focus-visible:opacity-100"
                aria-label={t("hero.next")}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Slider Indicators aligned cleanly with container */}
            <div className="pointer-events-none absolute inset-x-0 bottom-2 sm:bottom-5 z-30">
                <div className="app-container flex justify-center sm:justify-end">
                    <div className="pointer-events-auto flex items-center gap-0.5 sm:gap-1.5">
                        {movies.map((_, idx) => (
                            <Button
                                key={idx}
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => goToSlide(idx)}
                                className="group h-auto w-auto min-h-[44px] min-w-[32px] sm:min-h-0 sm:min-w-0 px-1.5 py-2 sm:p-1.5 rounded-full hover:bg-transparent"
                                aria-label={t("hero.goToSlide", { number: idx + 1 })}
                            >
                                <span
                                    className={cn(
                                        "block h-1.5 rounded-full transition-all duration-300",
                                        currentIndex === idx
                                            ? "w-7 sm:w-8 bg-primary shadow-sm shadow-primary/60"
                                            : "w-2 bg-white/35 group-hover:bg-white/70"
                                    )}
                                />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
};

export default Movie;
