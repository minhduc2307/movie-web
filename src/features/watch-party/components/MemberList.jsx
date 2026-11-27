import { useTranslation } from "react-i18next";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MemberList = ({ memberSlots, hostUid, currentUid }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-2.5 p-3">
            {memberSlots.map(({ slotIndex, member }) => {
                if (!member?.uid) {
                    return (
                        <div
                            key={slotIndex}
                            className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs text-slate-500"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-white/15 text-[11px] font-semibold">
                                {slotIndex + 1}
                            </div>
                            <span>{t("room.emptySlot")}</span>
                        </div>
                    );
                }

                const isHost = member.uid === hostUid;
                const isMe = member.uid === currentUid;
                const initial = (member.name || "U").trim().charAt(0).toUpperCase();

                return (
                    <div
                        key={slotIndex}
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-white/15">
                                <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                    {member.name}
                                    {isMe && (
                                        <span className="ml-1.5 text-xs font-normal text-slate-400">
                                            ({t("room.you")})
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {isHost && (
                            <Badge className="shrink-0 gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-semibold">
                                <Crown className="h-3 w-3" />
                                <span>{t("room.hostBadge")}</span>
                            </Badge>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MemberList;
