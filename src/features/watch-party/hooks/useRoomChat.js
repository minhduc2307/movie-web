import { useCallback, useEffect, useRef, useState } from "react";
import {
    CHAT_MAX_LENGTH,
    CHAT_MESSAGE_LIMIT,
    CHAT_THROTTLE_MS,
} from "@/features/watch-party/lib/constants";
import {
    sendRoomMessage,
    subscribeRoomMessages,
} from "@/services/firebase/chatService";

export const useRoomChat = ({ roomId, user, isMember, isActiveTab }) => {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSending, setIsSending] = useState(false);

    const seenIdsRef = useRef(new Set());
    const lastSentAtRef = useRef(0);
    const initialLoadDoneRef = useRef(false);
    const isActiveTabRef = useRef(isActiveTab);
    isActiveTabRef.current = isActiveTab;

    useEffect(() => {
        if (isActiveTab) {
            setUnreadCount(0);
        }
    }, [isActiveTab]);

    useEffect(() => {
        if (!roomId || !user?.uid) {
            setMessages([]);
            setUnreadCount(0);
            seenIdsRef.current.clear();
            return;
        }

        let cancelled = false;
        let unsubscribe = null;

        seenIdsRef.current.clear();
        initialLoadDoneRef.current = false;
        setMessages([]);
        setUnreadCount(0);

        subscribeRoomMessages(roomId, {
            onMessage: (msg) => {
                if (cancelled || seenIdsRef.current.has(msg.id)) return;
                seenIdsRef.current.add(msg.id);

                setMessages((prev) => {
                    const next = [...prev, msg];
                    return next.length > CHAT_MESSAGE_LIMIT
                        ? next.slice(next.length - CHAT_MESSAGE_LIMIT)
                        : next;
                });

                if (
                    initialLoadDoneRef.current &&
                    !isActiveTabRef.current &&
                    msg.uid !== user.uid
                ) {
                    setUnreadCount((count) => count + 1);
                }
            },
            onInitialLoaded: () => {
                if (!cancelled) {
                    initialLoadDoneRef.current = true;
                }
            },
            onError: (err) => {
                if (import.meta.env.DEV) {
                    console.error("[useRoomChat] Subscription error:", err);
                }
            },
        })
            .then((unsub) => {
                if (cancelled) unsub?.();
                else unsubscribe = unsub;
            })
            .catch((err) => {
                if (import.meta.env.DEV) {
                    console.error("[useRoomChat] Init error:", err);
                }
            });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [roomId, user?.uid]);

    const sendMessage = useCallback(
        async (rawText) => {
            const cleanText = String(rawText || "").trim();
            if (!cleanText || !isMember || !user?.uid || !roomId) {
                return { ok: false, reason: "invalid" };
            }
            if (cleanText.length > CHAT_MAX_LENGTH) {
                return { ok: false, reason: "too_long" };
            }

            const now = Date.now();
            if (now - lastSentAtRef.current < CHAT_THROTTLE_MS) {
                return { ok: false, reason: "throttled" };
            }

            lastSentAtRef.current = now;
            setIsSending(true);
            try {
                await sendRoomMessage({ roomId, user, text: cleanText });
                return { ok: true };
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error("[useRoomChat] Send error:", err);
                }
                return { ok: false, reason: "error" };
            } finally {
                setIsSending(false);
            }
        },
        [roomId, user, isMember]
    );

    return {
        messages,
        unreadCount,
        isSending,
        sendMessage,
    };
};
