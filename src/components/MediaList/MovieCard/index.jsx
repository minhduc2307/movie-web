import Img from "@components/Img";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeImageUrl, optimizeImageUrl } from "@/services/api";
import { localizeMovieMetaText } from "@lib/movieUtils";
import { prefetchMovieDetail } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";

const getTypeLabel = (type, t) => {
    switch (type) {
        case "tv":
        case "series":
            return t("movie.series");
        case "single":
            return t("movie.single");
        case "hoathinh":
            return t("movie.anime");
        default:
            return type ? type.toUpperCase() : null;
    }
};

const MovieCard = ({
    name,
    year,
    posterUrl,
    type,
    time,
    slug,
    category,
    quality,
    episodeCurrent,
    reserveTopRight = false,
    fetchPriority = "low",
    progressPercent = null,
}) => {
    const { t, i18n } = useTranslation();
    const rawGenre =
        (Array.isArray(category) && category[0]?.name) ||
        (typeof category === "string" ? category : null) ||
        getTypeLabel(type, t);
    const genreLabel = localizeMovieMetaText(rawGenre, i18n.language);

    const statusBadge = localizeMovieMetaText(episodeCurrent || quality, i18n.language);
    const formattedTime = localizeMovieMetaText(time, i18n.language);

    const handlePrefetch = () => {
        if (slug) prefetchMovieDetail(slug);
    };

    return (
        <Link
            to={`/movies/${slug}`}
            onMouseEnter={handlePrefetch}
            onFocus={handlePrefetch}
            className="group block h-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        >
            <Card className="relative flex h-full flex-col overflow-hidden rounded-xl border-border/80 bg-card shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10">
                {/* Full-bleed Edge-to-Edge Poster Container (2:3) */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                    <Img
                        src={optimizeImageUrl(posterUrl, { width: 400 })}
                        fallbackSrc={normalizeImageUrl(posterUrl)}
                        width={200}
                        height={300}
                        fetchPriority={fetchPriority}
                        alt={name || "Poster phim"}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Subtle bottom vignette on poster */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Top-left Status / Episode Badge (stays crisp above hover backdrop blur) */}
                    {statusBadge && (
                        <div
                            className={`pointer-events-none absolute left-2 top-2 z-[15] flex ${
                                reserveTopRight ? "right-14 sm:right-11" : "right-2"
                            }`}
                        >
                            <Badge className="max-w-full overflow-hidden bg-primary text-primary-foreground border-none px-2 py-0.5 text-[11px] font-bold shadow-md">
                                <span className="block truncate">{statusBadge}</span>
                            </Badge>
                        </div>
                    )}

                    {/* Bottom-left Genre Badge over dark vignette */}
                    {genreLabel && (
                        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-[15] flex">
                            <Badge
                                variant="secondary"
                                className="max-w-full overflow-hidden backdrop-blur-md bg-black/75 text-white border border-white/15 px-2 py-0.5 text-[11px] font-medium shadow-md"
                            >
                                <span className="block truncate">{genreLabel}</span>
                            </Badge>
                        </div>
                    )}

                    {/* Dark overlay & glowing play button on hover (below badges, blurs poster only) */}
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/50 transition-all duration-300 scale-75 group-hover:scale-100">
                            <Play className="h-6 w-6 fill-current ml-0.5" />
                        </div>
                    </div>

                    {typeof progressPercent === "number" && progressPercent > 0 && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 bg-white/25">
                            <div
                                className="h-full bg-primary transition-[width]"
                                style={{ width: `${Math.min(100, Math.max(2, progressPercent))}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Movie Info Block */}
                <div className="flex flex-1 flex-col justify-between gap-2.5 p-3 sm:p-3.5">
                    <h3
                        className="line-clamp-2 min-h-[2.6rem] text-[15px] sm:text-base min-[2000px]:text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary dark:group-hover:text-rose-400"
                        title={name}
                    >
                        {name}
                    </h3>

                    <div className="flex items-center justify-between gap-2 text-xs sm:text-[13px] font-medium text-muted-foreground">
                        <span>{year || t("movie.updating")}</span>
                        {formattedTime && (
                            <span className="inline-flex items-center gap-1 truncate max-w-[130px]">
                                <Clock className="h-3.5 w-3.5 shrink-0 opacity-75" />
                                <span className="truncate">{formattedTime}</span>
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default MovieCard;
