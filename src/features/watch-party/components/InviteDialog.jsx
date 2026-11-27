import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Copy, Check, Link2, Users } from "lucide-react";
import { MAX_ROOM_MEMBERS } from "@/features/watch-party/lib/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const InviteDialog = ({ open, onOpenChange, roomId, memberCount }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const copyTimerRef = useRef(null);

    const inviteUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/rooms/${roomId}`
            : `/rooms/${roomId}`;

    useEffect(() => {
        if (!open) {
            setCopied(false);
        }
        return () => {
            if (copyTimerRef.current) {
                clearTimeout(copyTimerRef.current);
                copyTimerRef.current = null;
            }
        };
    }, [open]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            toast.success(t("room.copiedInvite"), { id: "room-copy-invite" });
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            copyTimerRef.current = setTimeout(() => {
                copyTimerRef.current = null;
                setCopied(false);
            }, 2000);
        } catch {
            toast.error(t("room.copyError"), { id: "room-copy-err" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-border bg-card text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between gap-2 pr-6">
                        <span className="flex items-center gap-2">
                            <Link2 className="h-5 w-5 text-primary" />
                            <span>{t("room.inviteTitle")}</span>
                        </span>
                        <Badge variant="secondary" className="gap-1 text-xs">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                                {memberCount}/{MAX_ROOM_MEMBERS}
                            </span>
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>{t("room.inviteDesc")}</DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 pt-2">
                    <Input
                        readOnly
                        value={inviteUrl}
                        onFocus={(e) => e.target.select()}
                        aria-label={t("room.inviteTitle")}
                        className="h-10 font-mono text-xs"
                    />
                    <Button
                        type="button"
                        onClick={handleCopy}
                        className="h-10 shrink-0 gap-1.5 bg-primary text-white hover:bg-primary/90"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? t("room.copied") : t("room.copyLink")}</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteDialog;
