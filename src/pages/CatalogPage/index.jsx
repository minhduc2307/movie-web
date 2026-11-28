import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, RotateCcw, Film, Home, RefreshCw } from "lucide-react";
import { movieService } from "@/services/api";
import { queryKeys } from "@/lib/queryClient";
import MovieCard from "@components/MediaList/MovieCard";
import MovieCardSkeleton from "@components/MediaList/MovieCardSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FilterSelect } from "@/components/common";
import FilterSidebar, { TYPE_OPTIONS } from "./FilterSidebar";
import CatalogPagination from "./CatalogPagination";

const SORT_OPTIONS = [
    { value: "modified.time", labelKey: "catalog.sortNewest" },
    { value: "year", labelKey: "catalog.sortYear" },
    { value: "_id", labelKey: "catalog.sortPopular" },
];

const CatalogPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeType = searchParams.get("type") || "phim-moi-cap-nhat";
    const activeKeyword = searchParams.get("keyword") || "";
    const activeCategory = searchParams.get("category") || "";
    const activeCountry = searchParams.get("country") || "";
    const activeYear = searchParams.get("year") || "";
    const activeSort = searchParams.get("sort") || "modified.time";
    const activePage = Math.max(1, Number(searchParams.get("page")) || 1);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { data: catRes } = useQuery({
        queryKey: queryKeys.categories(),
        queryFn: () => movieService.getCategories(),
        staleTime: 10 * 60 * 1000,
    });
    const { data: countryRes } = useQuery({
        queryKey: queryKeys.countries(),
        queryFn: () => movieService.getCountries(),
        staleTime: 10 * 60 * 1000,
    });
    const { data: yearRes } = useQuery({
        queryKey: queryKeys.years(),
        queryFn: () => movieService.getYears(),
        staleTime: 10 * 60 * 1000,
    });

    const categories = catRes?.data?.items || [];
    const countries = countryRes?.data?.items || [];
    const years = (yearRes?.data?.items || []).slice(0, 15);

    const catalogFilterKey = {
        keyword: activeKeyword.trim(),
        type: activeType,
        category: activeCategory,
        country: activeCountry,
        year: activeYear,
        sort: activeSort,
        page: activePage,
    };

    const { data: catalogRes, isLoading, isError, refetch } = useQuery({
        queryKey: queryKeys.catalog(catalogFilterKey),
        queryFn: ({ signal }) =>
            activeKeyword.trim()
                ? movieService.searchMovies(
                      activeKeyword.trim(),
                      { page: activePage, limit: 24 },
                      signal
                  )
                : movieService.getMoviesByType(
                      activeType,
                      {
                          page: activePage,
                          limit: 24,
                          sort_field: activeSort,
                          sort_type: "desc",
                          ...(activeCategory ? { category: activeCategory } : {}),
                          ...(activeCountry ? { country: activeCountry } : {}),
                          ...(activeYear ? { year: activeYear } : {}),
                      },
                      signal
                  ),
        placeholderData: keepPreviousData,
    });

    const movies = catalogRes?.items || [];
    const totalItems = catalogRes?.pagination?.totalItems || 0;
    const perPage = catalogRes?.pagination?.totalItemsPerPage || 24;
    const pagination = {
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / perPage)),
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [activeKeyword, activeType, activeCategory, activeCountry, activeYear, activeSort, activePage]);

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (key !== "page") {
            next.delete("keyword");
        }
        if (!value || (key === "type" && value === "phim-moi-cap-nhat")) {
            next.delete(key);
        } else {
            next.set(key, value);
        }
        if (key !== "page") next.delete("page");
        setSearchParams(next);
    };

    const hasActiveFilters =
        Boolean(activeKeyword.trim()) ||
        activeType !== "phim-moi-cap-nhat" ||
        Boolean(activeCategory || activeCountry || activeYear);

    const activeTypeObj = TYPE_OPTIONS.find((opt) => opt.value === activeType);
    const pageHeading = activeKeyword.trim()
        ? t("search.resultsFor", { keyword: activeKeyword.trim() })
        : activeType !== "phim-moi-cap-nhat" && activeTypeObj
        ? t(activeTypeObj.labelKey)
        : t("catalog.title");

    useEffect(() => {
        document.title = `${pageHeading} — ${t("brand.name")}`;
    }, [pageHeading, t]);

    const sortOptions = SORT_OPTIONS.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey),
    }));

    return (
        <div className="min-h-screen bg-background text-foreground py-6 sm:py-8">
            <div className="app-container">
                <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
                    <Link to="/" className="flex items-center gap-1 hover:text-primary dark:hover:text-rose-400 transition-colors">
                        <Home className="h-3.5 w-3.5" />
                        <span>{t("nav.home")}</span>
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium truncate">
                        {pageHeading}
                    </span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                    <div className="flex flex-wrap items-center gap-3 min-w-0">
                        <span className="w-1.5 h-7 bg-gradient-to-b from-primary to-amber-500 rounded-full shrink-0" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                            {pageHeading}
                        </h1>
                        {!isLoading && (
                            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 shrink-0">
                                {t("catalog.totalResults", { count: pagination.totalItems.toLocaleString() })}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            aria-expanded={showMobileFilters}
                            aria-controls="catalog-filter-sidebar"
                            onClick={() => setShowMobileFilters((v) => !v)}
                            className="lg:hidden h-11 gap-2"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>{t("catalog.filters")}</span>
                        </Button>

                        {!activeKeyword.trim() && (
                            <div className="flex items-center gap-2">
                                <Label htmlFor="catalog-sort" className="text-sm font-normal text-muted-foreground hidden sm:inline shrink-0">
                                    {t("catalog.sortLabel")}:
                                </Label>
                                <FilterSelect
                                    id="catalog-sort"
                                    value={activeSort}
                                    onValueChange={(val) => updateFilter("sort", val)}
                                    options={sortOptions}
                                    ariaLabel={t("catalog.sortLabel")}
                                    triggerClassName="h-10 sm:h-9 w-[175px] bg-card font-medium"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="mt-6 flex flex-col lg:flex-row gap-8">
                    <FilterSidebar
                        showMobileFilters={showMobileFilters}
                        activeType={activeType}
                        activeCategory={activeCategory}
                        activeCountry={activeCountry}
                        activeYear={activeYear}
                        categories={categories}
                        countries={countries}
                        years={years}
                        hasActiveFilters={hasActiveFilters}
                        onUpdateFilter={updateFilter}
                        onResetFilters={() => setSearchParams({})}
                    />

                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                                {Array.from({ length: 12 }).map((_, idx) => (
                                    <MovieCardSkeleton key={idx} />
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 px-4 text-center">
                                <Film className="h-10 w-10 text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground">{t("common.loadSectionError")}</p>
                                <Button variant="outline" onClick={() => refetch()} className="mt-4 gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    <span>{t("watch.player.retry")}</span>
                                </Button>
                            </div>
                        ) : movies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 px-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                                    <Film className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">
                                    {t("catalog.noResultsTitle")}
                                </h3>
                                <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                                    {t("catalog.noResultsDesc")}
                                </p>
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={() => setSearchParams({})} className="mt-5 gap-2">
                                        <RotateCcw className="h-4 w-4" />
                                        <span>{t("catalog.clearFilters")}</span>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                                    {movies.map((movie) => (
                                        <MovieCard
                                            key={movie.id || movie._id}
                                            name={movie.name}
                                            posterUrl={movie.posterUrl || movie.poster_url}
                                            year={movie.year}
                                            time={movie.time}
                                            type={movie.type}
                                            slug={movie.slug}
                                            category={movie.category}
                                            quality={movie.quality || "FHD"}
                                            episodeCurrent={movie.episodeCurrent || movie.episode_current}
                                        />
                                    ))}
                                </div>

                                <CatalogPagination
                                    activePage={activePage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(p) => updateFilter("page", String(p))}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;
