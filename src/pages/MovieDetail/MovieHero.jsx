import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Play,
    Film,
    Heart,
    Star,
    Clock,
    Calendar,
    Eye,
    Sparkles,
} from "lucide-react";
import { normalizeImageUrl } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MovieHero = ({
    movieInfo,
    trailerKey,
    isFavorited,
    onToggleFavorite,
    onOpenTrailer,
}) => {
    const { t } = useTranslation();

    const voteAverage = movieInfo.tmdb?.vote_average
        ? Number(movieInfo.tmdb.vote_average).toFixed(1)
        : null;
    const posterUrl = normalizeImageUrl(
        movieInfo.posterUrl || movieInfo.poster_url
    );
    const thumbUrl = normalizeImageUrl(
        movieInfo.thumbUrl || movieInfo.thumb_url || posterUrl
    );
    const categories = movieInfo.category || [];

    return (
        <section className="relative w-full overflow-hidden bg-[#0b0f19] text-white">
            <img
                src={thumbUrl}
                alt={movieInfo.name}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-50 scale-105"
                onError={(e) => {
                    if (!e.target.src.endsWith("/NoImage.svg")) {
                        e.target.src = "/NoImage.svg";
                    }
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-[#0b0f19]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                    <div className="w-48 sm:w-56 md:w-64 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl">
                        <img
                            src={posterUrl}
                            alt={movieInfo.name}
                            className="aspect-[2/3] w-full object-cover"
                            onError={(e) => {
                                if (!e.target.src.endsWith("/NoImage.svg")) {
                                    e.target.src = "/NoImage.svg";
                                }
                            }}
                        />
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            {movieInfo.quality && (
                                <Badge className="bg-primary text-white font-bold px-2.5 py-0.5">
                                    {movieInfo.quality}
                                </Badge>
                            )}
                            {movieInfo.lang && (
                                <Badge
                                    variant="secondary"
                                    className="bg-white/15 text-white border-white/15 backdrop-blur-md"
                                >
                                    {movieInfo.lang}
                                </Badge>
                            )}
                            {movieInfo.episode_current && (
                                <Badge
                                    variant="outline"
                                    className="border-amber-400/50 text-amber-300 bg-amber-400/10"
                                >
                                    {movieInfo.episode_current}
                                </Badge>
                            )}
                            {movieInfo.chieurap && (
                                <Badge
                                    variant="outline"
                                    className="border-emerald-400/50 text-emerald-300 bg-emerald-400/10 gap-1"
                                >
                                    <Sparkles className="h-3 w-3" />
                                    {t("detail.inTheaters")}
                                </Badge>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                {movieInfo.name}
                            </h1>
                            {movieInfo.origin_name && (
                                <p className="mt-1.5 text-base sm:text-lg font-medium text-slate-300 italic">
                                    {movieInfo.origin_name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-200">
                            {voteAverage && Number(voteAverage) > 0 && (
                                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                                    <Star className="h-4 w-4 fill-amber-400" />
                                    {voteAverage}
                                    <span className="text-xs font-normal text-slate-400">
                                        TMDB
                                    </span>
                                </span>
                            )}
                            {movieInfo.year && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    {movieInfo.year}
                                </span>
                            )}
                            {movieInfo.time && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    {movieInfo.time}
                                </span>
                            )}
                            {typeof movieInfo.view === "number" && (
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4 text-slate-400" />
                                    {movieInfo.view.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {categories.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id || cat.slug}
                                        to={`/movies?category=${cat.slug}`}
                                    >
                                        <Badge
                                            variant="outline"
                                            className="border-white/20 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                                        >
                                            {cat.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                            <Button
                                asChild
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-white font-semibold px-7 rounded-xl shadow-lg shadow-primary/30 gap-2"
                            >
                                <Link to={`/watch/${movieInfo.slug}`}>
                                    <Play className="h-5 w-5 fill-current" />
                                    <span>{t("hero.watchNow")}</span>
                                </Link>
                            </Button>

                            {trailerKey && (
                                <Button
                                    type="button"
                                    size="lg"
                                    variant="outline"
                                    onClick={onOpenTrailer}
                                    className="backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/25 text-white rounded-xl gap-2"
                                >
                                    <Film className="h-5 w-5" />
                                    <span>{t("detail.trailer")}</span>
                                </Button>
                            )}

                            <Button
                                type="button"
                                size="lg"
                                variant="outline"
                                onClick={onToggleFavorite}
                                className={`backdrop-blur-md rounded-xl gap-2 transition-colors ${
                                    isFavorited
                                        ? "bg-rose-500/20 border-rose-500/60 text-rose-300 hover:bg-rose-500/30"
                                        : "bg-white/10 hover:bg-white/20 border-white/25 text-white"
                                }`}
                            >
                                <Heart
                                    className={`h-5 w-5 ${
                                        isFavorited ? "fill-rose-500 text-rose-500" : ""
                                    }`}
                                />
                                <span>
                                    {isFavorited
                                        ? t("movie.removeFavorite")
                                        : t("movie.addFavorite")}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MovieHero;
