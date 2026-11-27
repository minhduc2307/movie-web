import { useState, useEffect, useRef, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    LayoutGrid,
    Search,
    X,
    Film,
    Tv,
    MonitorPlay,
    Sparkles,
    Clapperboard,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AppTooltip } from "@/components/common";
import { movieService } from "@/services/api";
import useDebounce from "@hooks/useDebounce";
import { cn } from "@/lib/utils";
import SearchResultsDropdown from "./SearchResultsDropdown";

const QUICK_GENRES = [
    { labelKey: "genres.action", slug: "hanh-dong" },
    { labelKey: "genres.romance", slug: "tinh-cam" },
    { labelKey: "genres.historical", slug: "co-trang" },
    { labelKey: "genres.horror", slug: "kinh-di" },
];

const HeaderSearch = ({ className = "" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const searchInputId = useId();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const debouncedQuery = useDebounce(query, 350);

    useEffect(() => {
        const trimmed = debouncedQuery.trim();
        if (!trimmed) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);

        movieService
            .searchMovies(trimmed, { limit: 8 }, controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) {
                    setResults(data.items || []);
                }
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Header live search failed:", err);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [debouncedQuery]);

    const handleClear = () => {
        setQuery("");
        setResults([]);
        inputRef.current?.focus();
    };

    const handleSelectMovie = (slug) => {
        setIsFocused(false);
        navigate(`/movies/${slug}`);
    };

    const handleSubmitSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        setIsFocused(false);
        navigate(`/movies?keyword=${encodeURIComponent(trimmed)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmitSearch();
        } else if (e.key === "Escape") {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleSearchBlur = (e) => {
        const nextTarget = e.relatedTarget;
        if (
            nextTarget instanceof Node &&
            (containerRef.current?.contains(nextTarget) ||
                nextTarget.closest?.("[data-radix-popper-content-wrapper]"))
        ) {
            return;
        }
        setIsFocused(false);
    };

    const showDropdown = isFocused && query.trim().length > 0;

    return (
        <Popover open={showDropdown} onOpenChange={setIsFocused}>
            <div ref={containerRef} className={cn("relative w-full max-w-xl", className)}>
                <PopoverAnchor asChild>
                    <div
                        className={cn(
                            "flex h-11 sm:h-10 items-center rounded-full border border-border bg-secondary/70 transition-all duration-200 hover:border-border/90 focus-within:border-primary/70 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/15 focus-within:shadow-sm",
                            showDropdown && "border-primary/70 bg-background ring-2 ring-primary/15 shadow-sm"
                        )}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    aria-label={t("nav.categories")}
                                    className="flex h-full min-w-[44px] sm:min-w-0 items-center justify-center gap-1.5 rounded-none rounded-l-full bg-muted/90 px-3.5 text-sm font-semibold text-foreground hover:bg-muted shrink-0"
                                >
                                    <LayoutGrid className="h-4 w-4 text-primary dark:text-rose-400" />
                                    <span className="hidden sm:inline">{t("nav.categories")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-60 mt-2 border-border bg-card/95 backdrop-blur-md p-1.5"
                            >
                                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
                                    {t("catalog.typeLabel")}
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link to="/movies" className="flex items-center gap-2.5 cursor-pointer rounded-md px-2.5 py-2 font-medium">
                                        <Clapperboard className="h-4 w-4 text-primary dark:text-rose-400" />
                                        <span>{t("catalog.title")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/movies?type=phim-le" className="flex items-center gap-2.5 cursor-pointer rounded-md px-2.5 py-2">
                                        <Film className="h-4 w-4 text-muted-foreground" />
                                        <span>{t("nav.singleMovies")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/movies?type=phim-bo" className="flex items-center gap-2.5 cursor-pointer rounded-md px-2.5 py-2">
                                        <Tv className="h-4 w-4 text-muted-foreground" />
                                        <span>{t("nav.series")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/movies?type=hoat-hinh" className="flex items-center gap-2.5 cursor-pointer rounded-md px-2.5 py-2">
                                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                                        <span>{t("nav.anime")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/movies?type=tv-shows" className="flex items-center gap-2.5 cursor-pointer rounded-md px-2.5 py-2">
                                        <MonitorPlay className="h-4 w-4 text-muted-foreground" />
                                        <span>{t("nav.tvShows")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
                                    {t("footer.genres")}
                                </DropdownMenuLabel>
                                <div className="grid grid-cols-2 gap-1 px-1 pb-1">
                                    {QUICK_GENRES.map((genre) => (
                                        <DropdownMenuItem key={genre.slug} asChild>
                                            <Link
                                                to={`/movies?category=${genre.slug}`}
                                                className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                                            >
                                                {t(genre.labelKey)}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Separator orientation="vertical" className="h-5" />

                        <div className="relative flex flex-1 items-center pl-3 pr-1">
                            <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                            <Input
                                id={searchInputId}
                                name="q"
                                ref={inputRef}
                                type="text"
                                autoComplete="off"
                                value={query}
                                onFocus={() => setIsFocused(true)}
                                onBlur={handleSearchBlur}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setIsFocused(true);
                                }}
                                placeholder={t("search.placeholder")}
                                className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0"
                                aria-label={t("search.placeholder")}
                            />
                            {query && (
                                <AppTooltip label={t("search.clear")}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClear}
                                        aria-label={t("search.clear")}
                                        className="h-10 w-10 sm:h-8 sm:w-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </AppTooltip>
                            )}
                        </div>
                    </div>
                </PopoverAnchor>

                <PopoverContent
                    align="center"
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => {
                        if (containerRef.current?.contains(e.target)) {
                            e.preventDefault();
                        }
                    }}
                    className="w-[min(92vw,760px)] overflow-hidden rounded-2xl border-border bg-card p-0 shadow-2xl"
                >
                    <SearchResultsDropdown
                        query={query}
                        results={results}
                        isLoading={isLoading}
                        onSelectMovie={handleSelectMovie}
                        onViewAll={handleSubmitSearch}
                    />
                </PopoverContent>
            </div>
        </Popover>
    );
};

export default HeaderSearch;
