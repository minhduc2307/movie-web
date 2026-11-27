import { useTranslation } from "react-i18next";
import { Search, Loader2, Film, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { normalizeImageUrl, optimizeImageUrl } from "@/services/api";

const SearchResultsDropdown = ({
    query,
    results,
    isLoading,
    onSelectMovie,
    onViewAll,
}) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="flex items-center justify-between bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-2 min-w-0 truncate">
                    {isLoading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                            <span className="truncate">{t("search.loading")}</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{t("search.resultsFor", { keyword: query.trim() })}</span>
                        </>
                    )}
                </span>

                {!isLoading && results.length > 0 && onViewAll && (
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={onViewAll}
                        className="ml-3 h-auto shrink-0 p-0 text-xs font-semibold text-primary dark:text-rose-400"
                    >
                        {t("search.viewAll")}
                    </Button>
                )}
            </div>

            <Separator />

            <ScrollArea className="h-[min(65dvh,480px)]">
                <div className="p-2">
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
                                <Button
                                    key={movie.id || movie._id}
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onSelectMovie(movie.slug)}
                                    className="group flex h-auto w-full items-center justify-start gap-3.5 rounded-xl p-2.5 text-left font-normal whitespace-normal hover:bg-muted/70"
                                >
                                    <img
                                        src={optimizeImageUrl(movie.posterUrl || movie.poster_url, { width: 160 })}
                                        alt={movie.name}
                                        width={64}
                                        height={96}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-24 w-16 rounded-lg object-cover bg-muted shrink-0 border border-border/50 shadow-sm transition-transform duration-200 group-hover:scale-105"
                                        onError={(e) => {
                                            const img = e.target;
                                            const fallback = normalizeImageUrl(movie.posterUrl || movie.poster_url);
                                            if (!img.dataset.triedFallback && img.src !== fallback) {
                                                img.dataset.triedFallback = "1";
                                                img.src = fallback;
                                                return;
                                            }
                                            if (!img.src.endsWith("/NoImage.svg")) {
                                                img.src = "/NoImage.svg";
                                            }
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary dark:group-hover:text-rose-400 transition-colors">
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
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary dark:group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default SearchResultsDropdown;
