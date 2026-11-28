import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Horizontal snap-scrolling shelf with desktop prev/next navigation arrows,
 * matching Netflix-style OTT row browsing while staying touch-friendly on mobile/tablet.
 */
const MovieCarouselRow = ({ children, className }) => {
    const { t } = useTranslation();
    const scrollerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        updateScrollState();
        const el = scrollerRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(el);
        return () => observer.disconnect();
    }, [updateScrollState, children]);

    const scrollByPage = (direction) => {
        const el = scrollerRef.current;
        if (!el) return;
        const delta = Math.max(280, Math.round(el.clientWidth * 0.8));
        el.scrollBy({ left: direction * delta, behavior: "smooth" });
    };

    return (
        <div className="group/row relative">
            <div
                ref={scrollerRef}
                onScroll={updateScrollState}
                className={cn(
                    "no-scrollbar flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2",
                    className
                )}
            >
                {children}
            </div>

            {canScrollLeft && (
                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={t("hero.prev")}
                    onClick={() => scrollByPage(-1)}
                    className="hidden md:flex absolute -left-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-border/80 bg-background/90 text-foreground shadow-lg backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 hover:bg-background"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {canScrollRight && (
                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={t("hero.next")}
                    onClick={() => scrollByPage(1)}
                    className="hidden md:flex absolute -right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-border/80 bg-background/90 text-foreground shadow-lg backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 hover:bg-background"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
};

export default MovieCarouselRow;
