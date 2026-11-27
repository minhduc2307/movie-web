import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Users, Loader2, Server, Tv } from "lucide-react";
import { useAuth } from "@context/AuthProvider";
import { findBestHlsTarget } from "@lib/movieUtils";
import { createClientId } from "@lib/userUtils";
import { createRoom } from "@/services/firebase/roomService";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CreateRoomDialog = ({
    open,
    onOpenChange,
    movie,
    episodes = [],
    initialServer = 0,
    initialChapter = 0,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [selectedServer, setSelectedServer] = useState(initialServer);
    const [selectedChap, setSelectedChap] = useState(initialChapter);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!open) return;
        const best = findBestHlsTarget(episodes, initialServer, initialChapter);
        if (best) {
            setSelectedServer(best.serverIdx);
            setSelectedChap(best.episodeIndex);
        } else {
            setSelectedServer(initialServer);
            setSelectedChap(initialChapter);
        }
    }, [open, episodes, initialServer, initialChapter]);

    const chapterList = episodes[selectedServer]?.server_data || [];
    const selectedEpisode = chapterList[selectedChap];
    const isPlayable = Boolean(selectedEpisode?.link_m3u8?.trim());

    const handleCreate = async () => {
        if (!user || !movie || !isPlayable) return;
        setIsCreating(true);
        try {
            const clientId = createClientId();

            const roomId = await createRoom({
                user,
                movie,
                serverIdx: selectedServer,
                episodeIndex: selectedChap,
                clientId,
            });
            onOpenChange(false);
            navigate(`/rooms/${roomId}`);
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error("[CreateRoomDialog] Failed:", err);
            }
            toast.error(t("room.createError"), { id: "create-room-err" });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-border bg-card text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-primary" />
                        <span>{t("room.createTitle")}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {t("room.createSubtitle", { name: movie?.name || "" })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-1">
                    {episodes.length > 1 && (
                        <div className="space-y-2">
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <Server className="h-3.5 w-3.5" />
                                <span>{t("watch.server")}</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {episodes.map((srv, idx) => {
                                    const serverHasHls = (srv?.server_data || []).some((e) =>
                                        Boolean(e?.link_m3u8?.trim())
                                    );
                                    return (
                                        <Button
                                            key={srv.server_name || idx}
                                            type="button"
                                            size="sm"
                                            disabled={!serverHasHls}
                                            variant={selectedServer === idx ? "default" : "outline"}
                                            onClick={() => {
                                                setSelectedServer(idx);
                                                const firstHls = (srv?.server_data || []).findIndex(
                                                    (e) => Boolean(e?.link_m3u8?.trim())
                                                );
                                                setSelectedChap(firstHls >= 0 ? firstHls : 0);
                                            }}
                                            className="h-8 text-xs"
                                        >
                                            {srv.server_name || `Server ${idx + 1}`}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {chapterList.length > 1 && (
                        <div className="space-y-2">
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <Tv className="h-3.5 w-3.5" />
                                <span>{t("watch.episodes")}</span>
                            </p>
                            <div className="grid max-h-48 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
                                {chapterList.map((ep, idx) => {
                                    const epHasHls = Boolean(ep?.link_m3u8?.trim());
                                    const active = selectedChap === idx;
                                    return (
                                        <Button
                                            key={ep.link_m3u8 || ep.slug || idx}
                                            type="button"
                                            size="sm"
                                            disabled={!epHasHls}
                                            variant={active ? "default" : "outline"}
                                            onClick={() => setSelectedChap(idx)}
                                            className={cn("h-8 text-xs", active && "font-bold")}
                                        >
                                            <span className="truncate">{ep.name || idx + 1}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!isPlayable && (
                        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                            {t("room.hlsOnlyHint")}
                        </p>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isCreating}
                    >
                        {t("room.cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCreate}
                        disabled={isCreating || !isPlayable}
                        className="gap-2 bg-primary text-white hover:bg-primary/90"
                    >
                        {isCreating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Users className="h-4 w-4" />
                        )}
                        <span>{t("room.createAction")}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRoomDialog;
