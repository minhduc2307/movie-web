import Img from "@components/Img";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeImageUrl } from "@/services/api";
import { Badge } from "@/components/ui/badge";
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
}) => {
    const { t } = useTranslation();
    const genreLabel =
        (Array.isArray(category) && category[0]?.name) ||
        (typeof category === "string" ? category : null) ||
        getTypeLabel(type, t);

    const statusBadge = episodeCurrent || quality;

    return (
        <Link
            to={`/movies/${slug}`}
            className="group block h-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        >
            <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10">
                {/* Full-bleed Edge-to-Edge Poster Container (2:3) */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                    <Img
                        src={normalizeImageUrl(posterUrl)}
                        alt={name || "Poster phim"}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Subtle bottom vignette on poster */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Top-left Genre Badge */}
                    {genreLabel && (
                        <div className="absolute left-2.5 top-2.5 z-10">
                            <Badge
                                variant="secondary"
                                className="backdrop-blur-md bg-black/65 hover:bg-black/75 text-white border-white/15 px-2.5 py-0.5 text-xs font-medium shadow-md"
                            >
                                {genreLabel}
                            </Badge>
                        </div>
                    )}

                    {/* Top-right Quality / Episode Badge */}
                    {statusBadge && (
                        <div className="absolute right-2.5 top-2.5 z-10">
                            <Badge className="bg-primary/90 hover:bg-primary text-white border-none px-2 py-0.5 text-[11px] font-bold shadow-md">
                                {statusBadge}
                            </Badge>
                        </div>
                    )}

                    {/* Dark overlay & glowing play button on hover */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/50 transition-all duration-300 scale-75 group-hover:scale-100">
                            <Play className="h-6 w-6 fill-current ml-0.5" />
                        </div>
                    </div>
                </div>

                {/* Movie Info Block */}
                <div className="flex flex-1 flex-col justify-between gap-2.5 p-3 sm:p-3.5">
                    <h3
                        className="line-clamp-1 text-[15px] sm:text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
                        title={name}
                    >
                        {name}
                    </h3>

                    <div className="flex items-center justify-between gap-2 text-xs sm:text-[13px] font-medium text-muted-foreground">
                        <span>{year || t("movie.updating")}</span>
                        {time && (
                            <span className="inline-flex items-center gap-1 truncate max-w-[130px]">
                                <Clock className="h-3.5 w-3.5 shrink-0 opacity-75" />
                                <span className="truncate">{time}</span>
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default MovieCard;
