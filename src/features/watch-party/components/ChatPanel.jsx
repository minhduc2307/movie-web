import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";
import { CHAT_MAX_LENGTH } from "@/features/watch-party/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";

const BOTTOM_THRESHOLD_PX = 72;

const ChatComposer = memo(({ isMember, isSending, onSubmitMessage }) => {
    const { t } = useTranslation();
    const [draft, setDraft] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text) return;

        const result = await onSubmitMessage(text);
        if (result?.ok) {
            setDraft("");
        } else if (result?.reason === "throttled") {
            toast.warning(t("chat.throttled"), { id: "chat-throttle" });
        } else if (result?.reason === "too_long") {
            toast.error(t("chat.tooLong", { max: CHAT_MAX_LENGTH }), {
                id: "chat-length",
            });
        } else if (result?.reason === "error") {
            toast.error(t("chat.sendError"), { id: "chat-send-err" });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-white/10 bg-black/40 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
        >
            <div className="flex items-center gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={CHAT_MAX_LENGTH}
                    disabled={!isMember}
                    placeholder={
                        isMember ? t("chat.placeholder") : t("chat.joinRequired")
                    }
                    aria-label={t("chat.placeholder")}
                    className="h-10 border-white/15 bg-white/5 text-sm text-white placeholder:text-slate-400 focus-visible:ring-primary"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!isMember || isSending || !draft.trim()}
                    aria-label={t("chat.send")}
                    className="h-10 w-10 shrink-0 bg-primary text-white hover:bg-primary/90"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
            {draft.length > CHAT_MAX_LENGTH * 0.8 && (
                <p className="mt-1 text-right text-[11px] tabular-nums text-slate-400">
                    {draft.length}/{CHAT_MAX_LENGTH}
                </p>
            )}
        </form>
    );
});

ChatComposer.displayName = "ChatComposer";

const ChatPanel = ({
    messages,
    currentUid,
    isMember,
    isSending,
    onSendMessage,
}) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);
    const isNearBottomRef = useRef(true);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;
        isNearBottomRef.current = distanceFromBottom <= BOTTOM_THRESHOLD_PX;
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !isNearBottomRef.current) return;
        el.scrollTop = el.scrollHeight;
    }, [messages]);

    const handleSendMessage = useCallback(
        async (text) => {
            const result = await onSendMessage(text);
            if (result?.ok) {
                isNearBottomRef.current = true;
                requestAnimationFrame(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                });
            }
            return result;
        },
        [onSendMessage]
    );

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                role="log"
                aria-live="polite"
                aria-label={t("room.tabs.chat")}
                className="flex-1 space-y-3 overflow-y-auto p-3"
            >
                {messages.length === 0 ? (
                    <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-center text-slate-400">
                        <MessageSquare className="h-8 w-8 opacity-40" />
                        <p className="text-xs">{t("chat.empty")}</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            isOwn={msg.uid === currentUid}
                        />
                    ))
                )}
            </div>

            <ChatComposer
                isMember={isMember}
                isSending={isSending}
                onSubmitMessage={handleSendMessage}
            />
        </div>
    );
};

export default ChatPanel;
