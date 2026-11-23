import { useTranslation } from "react-i18next";
import { Film } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const TrailerDialog = ({ open, onOpenChange, movieName, trailerKey }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-border">
                <DialogHeader className="px-6 py-4 bg-card border-b border-border">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Film className="h-5 w-5 text-primary" />
                        <span>
                            {movieName} — {t("detail.trailer")}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                {open && trailerKey && (
                    <div className="aspect-video w-full bg-black">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            className="h-full w-full"
                            title={`${movieName} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TrailerDialog;
