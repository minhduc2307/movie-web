import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CatalogPagination = ({ activePage, totalPages, onPageChange }) => {
    const { t } = useTranslation();

    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 flex items-center justify-center gap-3">
            <Button
                variant="outline"
                size="sm"
                disabled={activePage <= 1}
                onClick={() => onPageChange(activePage - 1)}
                className="gap-1.5"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>{t("catalog.prevPage")}</span>
            </Button>

            <span className="px-3 text-sm font-medium text-muted-foreground">
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
                className="gap-1.5"
            >
                <span>{t("catalog.nextPage")}</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default CatalogPagination;
