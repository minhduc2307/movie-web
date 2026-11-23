import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    LayoutGrid,
    Search,
    X,
    Film,
    Tv,
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
    { label: "Hành Động", slug: "hanh-dong" },
    { label: "Tình Cảm", slug: "tinh-cam" },
    { label: "Cổ Trang", slug: "co-trang" },
    { label: "Kinh Dị", slug: "kinh-di" },
];

const HeaderSearch = ({ className = "" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const debouncedQuery = useDebounce(query, 350);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const showDropdown = isFocused && query.trim().length > 0;

    return (
        <div ref={containerRef} className={cn("relative w-full max-w-xl", className)}>
            <div
                className={cn(
                    "flex h-10 items-center rounded-full border bg-secondary/70 transition-all duration-200",
                    isFocused
                        ? "border-primary/70 bg-background ring-2 ring-primary/15 shadow-sm"
                        : "border-border hover:border-border/90"
                )}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex h-full items-center gap-1.5 rounded-l-full bg-primary/10 px-3.5 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors shrink-0 focus:outline-none"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            <span className="hidden sm:inline">{t("nav.categories")}</span>
                        </button>
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
                                <Clapperboard className="h-4 w-4 text-primary" />
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
                                <Tv className="h-4 w-4 text-muted-foreground" />
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
                                        {genre.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <span className="h-5 w-px bg-border shrink-0" />

                <div className="relative flex flex-1 items-center px-3">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onFocus={() => setIsFocused(true)}
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
                            className="ml-1.5 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
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
                />
            )}
        </div>
    );
};

export default HeaderSearch;
