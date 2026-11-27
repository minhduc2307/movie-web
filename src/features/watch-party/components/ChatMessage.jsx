import { memo } from "react";
import { cn } from "@/lib/utils";

const formatChatTime = (timestamp) => {
    if (!Number.isFinite(timestamp)) return "";
    try {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
};

const ChatMessage = memo(({ message, isOwn }) => {
    const timeLabel = formatChatTime(message.createdAt);

    return (
        <div
            className={cn(
                "flex flex-col gap-1",
                isOwn ? "items-end" : "items-start"
            )}
        >
            <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400">
                <span className={cn("font-semibold", isOwn && "text-primary")}>
                    {message.name}
                </span>
                {timeLabel && <span>{timeLabel}</span>}
            </div>

            <div
                className={cn(
                    "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-xs leading-relaxed sm:text-sm",
                    isOwn
                        ? "rounded-tr-sm bg-primary text-white"
                        : "rounded-tl-sm border border-white/10 bg-white/10 text-slate-100"
                )}
            >
                {message.text}
            </div>
        </div>
    );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
