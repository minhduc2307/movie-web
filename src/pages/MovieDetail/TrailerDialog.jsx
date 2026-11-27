import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Film, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const TrailerDialog = ({ open, onOpenChange, movieName, trailerKey }) => {
    const { t } = useTranslation();
    const [isFrameLoaded, setIsFrameLoaded] = useState(false);

    useEffect(() => {
        if (!open) {
            setIsFrameLoaded(false);
        }
    }, [open, trailerKey]);

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
                    <div className="relative aspect-video w-full bg-black">
                        {!isFrameLoaded && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-black/95 text-sm text-slate-300">
                                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                                <span>{t("detail.loadingTrailer")}</span>
                            </div>
                        )}
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            onLoad={() => setIsFrameLoaded(true)}
                            className={`relative z-10 h-full w-full transition-opacity duration-300 ${
                                isFrameLoaded ? "opacity-100" : "opacity-0"
                            }`}
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
