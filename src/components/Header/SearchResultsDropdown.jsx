import { useTranslation } from "react-i18next";
import { Search, Loader2, Film, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { normalizeImageUrl } from "@/services/api";

const SearchResultsDropdown = ({
    query,
    results,
    isLoading,
    onSelectMovie,
}) => {
    const { t } = useTranslation();

    return (
        <div className="absolute left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[640px] md:w-[680px] lg:w-[780px] top-12 z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-2">
                    {isLoading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                            <span>{t("search.loading")}</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-3.5 w-3.5" />
                            <span>{t("search.resultsFor", { keyword: query.trim() })}</span>
                        </>
                    )}
                </span>
            </div>

            <div className="max-h-[65dvh] sm:max-h-[480px] overflow-y-auto p-2">
                {!isLoading && results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <Film className="h-9 w-9 text-muted-foreground/50 mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">
                            {t("search.empty")}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {results.map((movie) => (
                            <button
                                key={movie.id || movie._id}
                                type="button"
                                onClick={() => onSelectMovie(movie.slug)}
                                className="flex w-full items-center gap-3.5 rounded-xl p-2.5 text-left hover:bg-muted/70 transition-colors group"
                            >
                                <img
                                    src={normalizeImageUrl(movie.posterUrl || movie.poster_url)}
                                    alt={movie.name}
                                    className="h-24 w-16 rounded-lg object-cover bg-muted shrink-0 border border-border/50 shadow-sm transition-transform duration-200 group-hover:scale-105"
                                    onError={(e) => {
                                        if (!e.target.src.endsWith("/NoImage.svg")) {
                                            e.target.src = "/NoImage.svg";
                                        }
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                                        {movie.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground mt-1">
                                        {movie.originName || movie.origin_name || ""}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        {movie.year && (
                                            <Badge variant="outline" className="text-[11px] px-1.5 py-0 h-5">
                                                {movie.year}
                                            </Badge>
                                        )}
                                        {movie.quality && (
                                            <Badge variant="secondary" className="text-[11px] px-1.5 py-0 h-5">
                                                {movie.quality}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsDropdown;
