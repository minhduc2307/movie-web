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
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const showDropdown = isFocused && query.trim().length > 0;

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full max-w-xl", className)}
        >
            <div
                className={cn(
                    "flex h-11 items-center rounded-full border bg-secondary/70 transition-all duration-200 sm:h-10",
                    isFocused
                        ? "border-primary/70 bg-background shadow-sm ring-2 ring-primary/15"
                        : "border-border hover:border-border/90",
                )}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label={t("nav.categories")}
                            className="flex h-full min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-l-full bg-muted/90 px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-0"
                        >
                            <LayoutGrid className="h-4 w-4 text-primary dark:text-rose-400" />
                            <span className="hidden sm:inline">
                                {t("nav.categories")}
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="mt-2 w-60 border-border bg-card/95 p-1.5 backdrop-blur-md"
                    >
                        <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t("catalog.typeLabel")}
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/movies"
                                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 font-medium"
                            >
                                <Clapperboard className="h-4 w-4 text-primary dark:text-rose-400" />
                                <span>{t("catalog.title")}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/movies?type=phim-le"
                                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2"
                            >
                                <Film className="h-4 w-4 text-muted-foreground" />
                                <span>{t("nav.singleMovies")}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/movies?type=phim-bo"
                                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2"
                            >
                                <Tv className="h-4 w-4 text-muted-foreground" />
                                <span>{t("nav.series")}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/movies?type=hoat-hinh"
                                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2"
                            >
                                <Sparkles className="h-4 w-4 text-muted-foreground" />
                                <span>{t("nav.anime")}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/movies?type=tv-shows"
                                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2"
                            >
                                <MonitorPlay className="h-4 w-4 text-muted-foreground" />
                                <span>{t("nav.tvShows")}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
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

                <span className="h-5 w-px shrink-0 bg-border" />

                <div className="relative flex flex-1 items-center pl-3 pr-1">
                    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        id={searchInputId}
                        name="q"
                        ref={inputRef}
                        type="text"
                        autoComplete="off"
                        value={query}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsFocused(true);
                        }}
                        placeholder={t("search.placeholder")}
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        aria-label={t("search.placeholder")}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label={t("search.clear")}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-8 sm:w-8"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {showDropdown && (
                <SearchResultsDropdown
                    query={query}
                    results={results}
                    isLoading={isLoading}
                    onSelectMovie={handleSelectMovie}
                    onViewAll={handleSubmitSearch}
                />
            )}
        </div>
    );
};

export default HeaderSearch;
