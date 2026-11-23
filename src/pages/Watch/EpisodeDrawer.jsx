import { useTranslation } from "react-i18next";
import { X, Play, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EpisodeDrawer = ({
    open,
    servers,
    currentServer,
    chapterList,
    currentChap,
    onSelectServer,
    onSelectChapter,
    onClose,
}) => {
    const { t } = useTranslation();

    if (!open || chapterList.length <= 1) return null;

    return (
        <div className="absolute inset-y-0 right-0 z-30 w-80 max-w-[85vw] border-l border-white/10 bg-[#0d111c]/95 p-5 backdrop-blur-xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="flex items-center gap-2 text-base font-bold text-white">
                    <ListVideo className="h-4 w-4 text-primary" />
                    <span>{t("watch.episodes")}</span>
                </h2>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {servers.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {servers.map((srv, idx) => (
                        <Button
                            key={srv.server_name || idx}
                            type="button"
                            size="sm"
                            variant={currentServer === idx ? "default" : "outline"}
                            onClick={() => onSelectServer(idx)}
                            className={cn(
                                "h-8 text-xs",
                                currentServer !== idx &&
                                    "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15"
                            )}
                        >
                            {srv.server_name || `Server ${idx + 1}`}
                        </Button>
                    ))}
                </div>
            )}

            <div className="mt-4 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                    {chapterList.map((chap, index) => {
                        const isActive = currentChap === index;
                        return (
                            <Button
                                key={chap.link_m3u8 || chap.slug || index}
                                type="button"
                                size="sm"
                                variant={isActive ? "default" : "outline"}
                                className={cn(
                                    "h-9 text-xs font-medium",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/30"
                                        : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15"
                                )}
                                onClick={() => {
                                    onSelectChapter(index);
                                    onClose();
                                }}
                            >
                                {isActive && <Play className="mr-1 h-3 w-3 fill-current" />}
                                <span className="truncate">{chap.name || index + 1}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EpisodeDrawer;
