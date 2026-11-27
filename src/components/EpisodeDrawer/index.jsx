import { useTranslation } from "react-i18next";
import { X, Play, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const EpisodeDrawer = ({
    open,
    onOpenChange,
    servers,
    currentServer,
    chapterList,
    currentChap,
    onSelectServer,
    onSelectChapter,
}) => {
    const { t } = useTranslation();

    if (chapterList.length <= 1) return null;

    const closeDrawer = () => onOpenChange(false);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                hideCloseButton
                className="flex w-80 max-w-[85vw] flex-col border-l border-white/10 bg-[#0d111c]/95 p-0 text-white backdrop-blur-xl shadow-2xl"
            >
                <SheetHeader className="flex-row items-center justify-between space-y-0 px-5 py-4 text-left">
                    <SheetTitle className="flex items-center gap-2 text-base font-bold text-white">
                        <ListVideo className="h-4 w-4 text-primary dark:text-rose-400" />
                        <span>{t("watch.episodes")}</span>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        {t("watch.episodes")}
                    </SheetDescription>
                    <SheetClose asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t("nav.closeMenu")}
                            className="h-9 w-9 rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetClose>
                </SheetHeader>

                <Separator className="bg-white/10" />

                {servers.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 px-5 pt-4">
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
                                        "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white"
                                )}
                            >
                                {srv.server_name || `Server ${idx + 1}`}
                            </Button>
                        ))}
                    </div>
                )}

                <ScrollArea className="flex-1 px-5 py-4">
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
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                                            : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white"
                                    )}
                                    onClick={() => {
                                        onSelectChapter(index);
                                        closeDrawer();
                                    }}
                                >
                                    {isActive && <Play className="mr-1 h-3 w-3 fill-current" />}
                                    <span className="truncate">{chap.name || index + 1}</span>
                                </Button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default EpisodeDrawer;
