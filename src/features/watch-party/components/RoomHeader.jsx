import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Users,
    Share2,
    LogOut,
    Power,
    WifiOff,
    Play,
    Pause,
} from "lucide-react";
import { MAX_ROOM_MEMBERS } from "@/features/watch-party/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const RoomHeader = ({
    title,
    memberCount,
    isHost,
    isConnected,
    playback,
    onOpenInvite,
    onLeaveRoom,
    onCloseRoom,
}) => {
    const { t } = useTranslation();
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

    return (
        <>
            <header className="z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-black/80 px-3 backdrop-blur-md sm:px-5">
                <div className="flex min-w-0 items-center gap-2.5">
                    <Badge className="shrink-0 gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5">
                        <Users className="h-3 w-3" />
                        <span>
                            {memberCount}/{MAX_ROOM_MEMBERS}
                        </span>
                    </Badge>

                    <h1 className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
                        {title || t("room.defaultTitle")}
                    </h1>

                    {playback?.updatedByName && (
                        <span className="hidden xl:inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300">
                            {playback.state === "playing" ? (
                                <Play className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                            ) : (
                                <Pause className="h-2.5 w-2.5 text-amber-400" />
                            )}
                            <span className="max-w-[160px] truncate">
                                {playback.state === "playing"
                                    ? t("room.actorPlayed", { name: playback.updatedByName })
                                    : t("room.actorPaused", { name: playback.updatedByName })}
                            </span>
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {!isConnected && (
                        <Badge
                            variant="destructive"
                            className="animate-pulse gap-1 text-[11px]"
                        >
                            <WifiOff className="h-3 w-3" />
                            <span className="hidden sm:inline">{t("room.reconnecting")}</span>
                        </Badge>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onOpenInvite}
                        aria-label={t("room.inviteBtn")}
                        className="h-10 min-w-[40px] sm:h-9 gap-1.5 rounded-full border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    >
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("room.inviteBtn")}</span>
                    </Button>

                    {isHost && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmCloseOpen(true)}
                            aria-label={t("room.closeRoom")}
                            className="h-10 min-w-[40px] sm:h-9 gap-1.5 rounded-full"
                        >
                            <Power className="h-4 w-4" />
                            <span className="hidden md:inline">{t("room.closeRoom")}</span>
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onLeaveRoom}
                        aria-label={t("room.leaveRoom")}
                        className="h-10 min-w-[40px] sm:h-9 gap-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("room.leaveRoom")}</span>
                    </Button>
                </div>
            </header>

            <Dialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
                <DialogContent className="max-w-sm border-border bg-card text-foreground">
                    <DialogHeader>
                        <DialogTitle>{t("room.confirmCloseTitle")}</DialogTitle>
                        <DialogDescription>{t("room.confirmCloseDesc")}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmCloseOpen(false)}
                        >
                            {t("room.cancel")}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                setConfirmCloseOpen(false);
                                onCloseRoom();
                            }}
                        >
                            {t("room.closeRoom")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RoomHeader;
