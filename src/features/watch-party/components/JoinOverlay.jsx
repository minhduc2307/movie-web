import { useTranslation } from "react-i18next";
import { Play, Users } from "lucide-react";
import { MAX_ROOM_MEMBERS } from "@/features/watch-party/lib/constants";
import { Button } from "@/components/ui/button";

const JoinOverlay = ({ movieTitle, memberCount, onJoin }) => {
    const { t } = useTranslation();

    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/80 p-6 text-center backdrop-blur-md">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>
                    {t("room.watchingCount", {
                        count: memberCount,
                        max: MAX_ROOM_MEMBERS,
                    })}
                </span>
            </div>

            {movieTitle && (
                <h2 className="max-w-lg text-lg font-bold text-white sm:text-xl line-clamp-2">
                    {movieTitle}
                </h2>
            )}

            <p className="max-w-md text-xs text-slate-300 sm:text-sm">
                {t("room.joinHint")}
            </p>

            <Button
                type="button"
                size="lg"
                onClick={onJoin}
                className="h-12 gap-2 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-xl shadow-primary/30 transition-transform hover:scale-105 hover:bg-primary/90 sm:text-base"
            >
                <Play className="h-5 w-5 fill-current" />
                <span>{t("room.joinAndSync")}</span>
            </Button>
        </div>
    );
};

export default JoinOverlay;
