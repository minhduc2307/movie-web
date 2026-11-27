import { useTranslation } from "react-i18next";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FilterSelect } from "@/components/common";
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

    const categoryOptions = [
        { value: "", label: t("catalog.all") },
        ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    ];

    const countryOptions = [
        { value: "", label: t("catalog.all") },
        ...countries.map((c) => ({ value: c.slug, label: c.name })),
    ];

    const yearOptions = [
        { value: "", label: t("catalog.all") },
        ...years.map((y) => ({ value: String(y.year), label: String(y.year) })),
    ];

    return (
        <aside
            id="catalog-filter-sidebar"
            className={cn(
                "lg:w-64 shrink-0 space-y-4",
                showMobileFilters ? "block" : "hidden lg:block"
            )}
        >
            <Card className="dark:shadow-none">
                <CardContent className="p-4 lg:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                            <SlidersHorizontal className="h-4 w-4 text-primary dark:text-rose-400" />
                            <span>{t("catalog.filters")}</span>
                        </h2>
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={onResetFilters}
                                className="h-auto gap-1 p-0 text-xs font-medium text-primary dark:text-rose-400"
                            >
                                <RotateCcw className="h-3 w-3" />
                                <span>{t("catalog.clearFilters")}</span>
                            </Button>
                        )}
                    </div>

                    {/* Format Type */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t("catalog.typeLabel")}
                        </h3>
                        <div className="flex flex-col gap-0.5">
                            {TYPE_OPTIONS.map((opt) => {
                                const isSelected = activeType === opt.value;
                                return (
                                    <Button
                                        key={opt.value}
                                        type="button"
                                        variant={isSelected ? "default" : "ghost"}
                                        onClick={() => onUpdateFilter("type", opt.value)}
                                        className={cn(
                                            "h-10 lg:h-8 w-full justify-start gap-2.5 px-3 text-sm font-medium",
                                            isSelected
                                                ? "font-semibold shadow-sm"
                                                : "text-foreground/80 hover:text-foreground"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "h-2 w-2 rounded-full shrink-0",
                                                isSelected ? "bg-primary-foreground" : "bg-border"
                                            )}
                                        />
                                        <span className="truncate">{t(opt.labelKey)}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Genre */}
                    <div className="space-y-2.5">
                        <Label
                            htmlFor="filter-category"
                            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            {t("catalog.categoryLabel")}
                        </Label>
                        <FilterSelect
                            id="filter-category"
                            value={activeCategory}
                            onValueChange={(val) => onUpdateFilter("category", val)}
                            options={categoryOptions}
                            placeholder={t("catalog.all")}
                            ariaLabel={t("catalog.categoryLabel")}
                        />
                    </div>

                    <Separator />

                    {/* Country */}
                    <div className="space-y-2.5">
                        <Label
                            htmlFor="filter-country"
                            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            {t("catalog.countryLabel")}
                        </Label>
                        <FilterSelect
                            id="filter-country"
                            value={activeCountry}
                            onValueChange={(val) => onUpdateFilter("country", val)}
                            options={countryOptions}
                            placeholder={t("catalog.all")}
                            ariaLabel={t("catalog.countryLabel")}
                        />
                    </div>

                    <Separator />

                    {/* Release Year */}
                    <div className="space-y-2.5">
                        <Label
                            htmlFor="filter-year"
                            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            {t("catalog.yearLabel")}
                        </Label>
                        <FilterSelect
                            id="filter-year"
                            value={activeYear}
                            onValueChange={(val) => onUpdateFilter("year", val)}
                            options={yearOptions}
                            placeholder={t("catalog.all")}
                            ariaLabel={t("catalog.yearLabel")}
                        />
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
};

export default FilterSidebar;
