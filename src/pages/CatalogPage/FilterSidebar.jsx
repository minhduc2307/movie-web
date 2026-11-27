import { useTranslation } from "react-i18next";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export const TYPE_OPTIONS = [
    { value: "phim-moi-cap-nhat", labelKey: "catalog.all" },
    { value: "phim-le", labelKey: "nav.singleMovies" },
    { value: "phim-bo", labelKey: "nav.series" },
    { value: "hoat-hinh", labelKey: "nav.anime" },
    { value: "tv-shows", labelKey: "nav.tvShows" },
    { value: "phim-chieu-rap", labelKey: "nav.theaterMovies" },
];

const FilterSidebar = ({
    showMobileFilters,
    activeType,
    activeCategory,
    activeCountry,
    activeYear,
    categories,
    countries,
    years,
    hasActiveFilters,
    onUpdateFilter,
    onResetFilters,
}) => {
    const { t } = useTranslation();

    return (
        <aside
            className={cn(
                "lg:w-64 shrink-0 space-y-6",
                showMobileFilters ? "block" : "hidden lg:block"
            )}
        >
            <div className="rounded-2xl border border-border bg-card p-5 space-y-6 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                        <SlidersHorizontal className="h-4 w-4 text-primary dark:text-rose-400" />
                        <span>{t("catalog.filters")}</span>
                    </h2>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="flex items-center gap-1 py-1 text-xs font-medium text-primary dark:text-rose-400 hover:underline"
                        >
                            <RotateCcw className="h-3 w-3" />
                            <span>{t("catalog.clearFilters")}</span>
                        </button>
                    )}
                </div>

                {/* Format Type */}
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("catalog.typeLabel")}
                    </h3>
                    <div className="flex flex-col gap-1">
                        {TYPE_OPTIONS.map((opt) => {
                            const isSelected = activeType === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onUpdateFilter("type", opt.value)}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors",
                                        isSelected
                                            ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "h-2 w-2 rounded-full shrink-0",
                                            isSelected ? "bg-primary-foreground" : "bg-border"
                                        )}
                                    />
                                    <span>{t(opt.labelKey)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Genre */}
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                    <label
                        htmlFor="filter-category"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                        {t("catalog.categoryLabel")}
                    </label>
                    <select
                        id="filter-category"
                        name="category"
                        value={activeCategory}
                        onChange={(e) => onUpdateFilter("category", e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">{t("catalog.all")}</option>
                        {categories.map((cat) => (
                            <option key={cat._id || cat.slug} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country */}
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                    <label
                        htmlFor="filter-country"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                        {t("catalog.countryLabel")}
                    </label>
                    <select
                        id="filter-country"
                        name="country"
                        value={activeCountry}
                        onChange={(e) => onUpdateFilter("country", e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">{t("catalog.all")}</option>
                        {countries.map((c) => (
                            <option key={c._id || c.slug} value={c.slug}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Release Year */}
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                    <label
                        htmlFor="filter-year"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                        {t("catalog.yearLabel")}
                    </label>
                    <select
                        id="filter-year"
                        name="year"
                        value={activeYear}
                        onChange={(e) => onUpdateFilter("year", e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">{t("catalog.all")}</option>
                        {years.map((y) => (
                            <option key={y.year} value={String(y.year)}>
                                {y.year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
