import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CatalogPagination = ({ activePage, totalPages, onPageChange }) => {
    const { t } = useTranslation();

    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2 sm:gap-3">
            <Button
                variant="outline"
                size="sm"
                disabled={activePage <= 1}
                onClick={() => onPageChange(activePage - 1)}
                className="h-11 sm:h-9 gap-1 sm:gap-1.5 px-3 shrink-0"
            >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>{t("catalog.prevPage")}</span>
            </Button>

            <span className="px-1.5 sm:px-3 text-xs sm:text-sm font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                {t("catalog.page", {
                    current: activePage,
                    total: totalPages,
                })}
            </span>

            <Button
                variant="outline"
                size="sm"
                disabled={activePage >= totalPages}
                onClick={() => onPageChange(activePage + 1)}
                className="h-11 sm:h-9 gap-1 sm:gap-1.5 px-3 shrink-0"
            >
                <span>{t("catalog.nextPage")}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
        </nav>
    );
};

export default CatalogPagination;
