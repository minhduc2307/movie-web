import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeImageUrl, movieService } from "@/services/api";
import { cn } from "@/lib/utils";
import HeroSlideContent from "./HeroSlideContent";

const AUTO_PLAY_INTERVAL = 5500;

const Movie = ({ movies = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [resetTimer, setResetTimer] = useState(0);
    const [movieDetails, setMovieDetails] = useState({});
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
        if (movieDetails[activeMovie.slug] || activeMovie.content) return;

        let isCancelled = false;
        movieService
            .getMovieDetail(activeMovie.slug)
            .then((res) => {
                if (!isCancelled && res?.movie?.content) {
                    setMovieDetails((prev) => ({
                        ...prev,
                        [activeMovie.slug]: {
                            content: res.movie.content,
                            rating: res.movie.rating || activeMovie.rating,
                            category: res.movie.category || activeMovie.category,
                        },
                    }));
                }
            })
            .catch(() => {
                // Silently fallback to item metadata
            });

        return () => {
            isCancelled = true;
        };
    }, [currentIndex, movies, movieDetails]);

    if (!movies || count === 0) {
        return null;
    }

    const currentMovie = movies[currentIndex] || movies[0];
    const activeDetail = movieDetails[currentMovie.slug];

    const categoryName =
        (Array.isArray(activeDetail?.category) && activeDetail.category[0]?.name) ||
        (Array.isArray(currentMovie.category) && currentMovie.category[0]?.name) ||
        (typeof currentMovie.category === "string" ? currentMovie.category : null) ||
        (currentMovie.type === "series"
            ? "Phim bộ"
            : currentMovie.type === "hoathinh"
            ? "Hoạt hình"
            : "Phim lẻ");

    const rawRating =
        activeDetail?.rating ||
        currentMovie.rating ||
        currentMovie.tmdb?.vote_average ||
        currentMovie.vote_average;
    const rating = rawRating && Number(rawRating) > 0 ? Number(rawRating).toFixed(1) : "8.6";

    const rawContent = activeDetail?.content || currentMovie.content || currentMovie.description;
    const cleanDescription = rawContent
        ? rawContent.replace(/<[^>]*>/g, "").trim()
        : `${currentMovie.name} (${currentMovie.originName || currentMovie.year || ""}) - Phim thuộc thể loại ${categoryName || "đặc sắc"}, đem lại trải nghiệm giải trí đỉnh cao với chất lượng hình ảnh ${currentMovie.quality || "FHD"} sắc nét.`;

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
        <section
            className="group/hero relative w-full h-[540px] sm:h-[620px] lg:h-[72vh] lg:min-h-[580px] lg:max-h-[760px] overflow-hidden bg-[#0b0f19] select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-label="Phim nổi bật"
        >
            {/* Backdrop Slides Container */}
            <div className="absolute inset-0">
                {movies.map((movie, index) => {
                    const isCurrent = index === currentIndex;
                    const backdropUrl = normalizeImageUrl(
                        movie.thumbUrl || movie.thumb_url || movie.posterUrl || movie.poster_url
                    );

                    return (
                        <div
                            key={movie._id || movie.id || index}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                                isCurrent ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
                            )}
                        >
                            <img
                                src={backdropUrl}
                                alt={movie.name || "Backdrop"}
                                className={cn(
                                    "h-full w-full object-cover object-center transition-transform duration-1000 ease-out",
                                    isCurrent ? "scale-105" : "scale-100"
                                )}
                                loading={index === 0 ? "eager" : "lazy"}
                                onError={(e) => {
                                    if (e.target && !e.target.src.endsWith("/NoImage.svg")) {
                                        e.target.src = "/NoImage.svg";
                                    }
                                }}
                            />
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

            {/* Hero Spotlight Info Content with smooth key transition */}
            <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-12 w-12 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover/hero:opacity-100 focus-visible:opacity-100"
                aria-label="Phim trước"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-12 w-12 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover/hero:opacity-100 focus-visible:opacity-100"
                aria-label="Phim kế tiếp"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Slider Indicators: Expanding Active Pill with touch-friendly hit areas */}
            <div className="absolute bottom-5 sm:bottom-6 right-4 sm:right-8 z-30 flex items-center gap-1 sm:gap-1.5">
                {movies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className="group p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                        aria-label={`Chuyển đến phim ${idx + 1}`}
                    >
                        <span
                            className={cn(
                                "block h-1.5 rounded-full transition-all duration-300",
                                currentIndex === idx
                                    ? "w-7 sm:w-8 bg-primary shadow-sm shadow-primary/60"
                                    : "w-2 bg-white/35 group-hover:bg-white/70"
                            )}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Movie;
