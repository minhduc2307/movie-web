import { useTranslation } from "react-i18next";
import { MessageSquare, Users, ListVideo, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChatPanel from "./ChatPanel";
import MemberList from "./MemberList";

const RoomSidebar = ({
    activeTab,
    onTabChange,
    messages,
    unreadCount,
    isSending,
    onSendMessage,
    memberSlots,
    memberCount,
    hostUid,
    currentUid,
    isMember,
    servers,
    currentServer,
    currentEpisode,
    onSelectEpisode,
}) => {
    const { t } = useTranslation();
    const chapterList = servers[currentServer]?.server_data || [];

    return (
        <aside className="flex h-full min-h-0 flex-col border-t border-white/10 bg-[#0b101b] lg:border-l lg:border-t-0">
            <Tabs
                value={activeTab}
                onValueChange={onTabChange}
                className="flex h-full min-h-0 flex-col"
            >
                <TabsList className="mx-3 mt-2.5 grid h-10 shrink-0 grid-cols-3 bg-white/5 text-slate-300">
                    <TabsTrigger
                        value="chat"
                        className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{t("room.tabs.chat")}</span>
                        {unreadCount > 0 && (
                            <Badge className="h-4 min-w-[16px] bg-amber-500 px-1 text-[10px] font-bold text-black">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>

                    <TabsTrigger
                        value="members"
                        className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                        <Users className="h-3.5 w-3.5" />
                        <span>
                            {t("room.tabs.members")} ({memberCount})
                        </span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="episodes"
                        className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                        <ListVideo className="h-3.5 w-3.5" />
                        <span>{t("room.tabs.episodes")}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-2 flex-1 min-h-0 overflow-hidden">
                    <ChatPanel
                        messages={messages}
                        currentUid={currentUid}
                        isMember={isMember}
                        isSending={isSending}
                        onSendMessage={onSendMessage}
                    />
                </TabsContent>

                <TabsContent value="members" className="mt-2 flex-1 min-h-0 overflow-y-auto">
                    <MemberList
                        memberSlots={memberSlots}
                        hostUid={hostUid}
                        currentUid={currentUid}
                    />
                </TabsContent>

                <TabsContent value="episodes" className="mt-2 flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
                    {servers.length > 1 && (
                        <div className="flex flex-wrap gap-1.5">
                            {servers.map((srv, sIdx) => {
                                const serverHasHls = (srv?.server_data || []).some((e) =>
                                    Boolean(e?.link_m3u8?.trim())
                                );
                                return (
                                    <Button
                                        key={srv.server_name || sIdx}
                                        type="button"
                                        size="sm"
                                        disabled={!isMember || !serverHasHls}
                                        variant={currentServer === sIdx ? "default" : "outline"}
                                        onClick={() => {
                                            const firstHls = (srv?.server_data || []).findIndex(
                                                (e) => Boolean(e?.link_m3u8?.trim())
                                            );
                                            if (firstHls >= 0) {
                                                onSelectEpisode(sIdx, firstHls);
                                            }
                                        }}
                                        className={cn(
                                            "h-8 text-xs",
                                            currentServer !== sIdx &&
                                                "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15"
                                        )}
                                    >
                                        {srv.server_name || `Server ${sIdx + 1}`}
                                    </Button>
                                );
                            })}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                        {chapterList.map((chap, idx) => {
                            const hasHls = Boolean(chap?.link_m3u8?.trim());
                            const isActive = currentEpisode === idx;
                            return (
                                <Button
                                    key={chap.link_m3u8 || chap.slug || idx}
                                    type="button"
                                    size="sm"
                                    disabled={!isMember || !hasHls}
                                    variant={isActive ? "default" : "outline"}
                                    onClick={() => onSelectEpisode(currentServer, idx)}
                                    className={cn(
                                        "h-9 text-xs font-medium",
                                        isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/30"
                                            : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15"
                                    )}
                                >
                                    {isActive && <Play className="mr-1 h-3 w-3 fill-current" />}
                                    <span className="truncate">{chap.name || idx + 1}</span>
                                </Button>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </aside>
    );
};

export default RoomSidebar;
