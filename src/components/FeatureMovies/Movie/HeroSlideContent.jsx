import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HeroSlideContent = ({
    movie,
    categoryName,
    rating,
    cleanDescription,
}) => {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl sm:max-w-3xl space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                {categoryName && (
                    <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-white/10 hover:bg-white/15 text-white border-white/20 px-2.5 py-0.5 text-xs font-semibold shadow-sm"
                    >
                        {categoryName}
                    </Badge>
                )}
                {movie.year && (
                    <span className="font-semibold text-zinc-300">{movie.year}</span>
                )}
                <Badge className="bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5 shadow-sm">
                    {movie.quality || "FHD"}
                </Badge>
                <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{rating}</span>
                    <span className="text-[11px] font-normal text-zinc-400">TMDB</span>
                </div>
            </div>

            <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl line-clamp-2 leading-[1.15]"
                title={movie.name}
            >
                {movie.name}
            </h1>

            {movie.originName && (
                <p className="text-base sm:text-lg font-medium text-slate-300 italic line-clamp-1">
                    {movie.originName}
                </p>
            )}

            <p className="line-clamp-2 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl drop-shadow">
                {cleanDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
                <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 sm:text-base shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 active:scale-95 gap-2 rounded-xl"
                >
                    <Link to={`/watch/${movie.slug}`}>
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                        <span>{t("hero.watchNow")}</span>
                    </Link>
                </Button>

                <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium px-6 py-2.5 sm:text-base transition-all duration-200 hover:scale-105 active:scale-95 gap-2 rounded-xl"
                >
                    <Link to={`/movies/${movie.slug}`}>
                        <Info className="h-5 w-5" />
                        <span>{t("hero.details")}</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default HeroSlideContent;
