import { getRtdb } from "@/lib/firebase/database";
import { getSafeDisplayName } from "@/lib/userUtils";
import {
    CHAT_MAX_LENGTH,
    CHAT_MESSAGE_LIMIT,
} from "@/features/watch-party/lib/constants";

export const subscribeRoomMessages = async (
    roomId,
    { onMessage, onInitialLoaded, onError }
) => {
    const [db, { limitToLast, onChildAdded, onValue, query, ref }] =
        await Promise.all([getRtdb(), import("firebase/database")]);

    const messagesQuery = query(
        ref(db, `rooms/${roomId}/messages`),
        limitToLast(CHAT_MESSAGE_LIMIT)
    );

    const unsubChild = onChildAdded(
        messagesQuery,
        (snap) => {
            if (!snap.exists()) return;
            onMessage({
                id: snap.key,
                ...snap.val(),
            });
        },
        (err) => {
            onError?.(err);
        }
    );

    // Firebase guarantees once-value fires strictly after all initial child_added events
    const unsubInitial = onValue(
        messagesQuery,
        () => {
            onInitialLoaded?.();
        },
        () => {
            onInitialLoaded?.();
        },
        { onlyOnce: true }
    );

    return () => {
        unsubChild();
        unsubInitial();
    };
};

export const sendRoomMessage = async ({ roomId, user, text }) => {
    const cleanText = String(text || "").trim();
    if (!cleanText) return false;
    if (cleanText.length > CHAT_MAX_LENGTH) {
        throw new Error("MESSAGE_TOO_LONG");
    }

    const [db, { push, ref, serverTimestamp, set }] = await Promise.all([
        getRtdb(),
        import("firebase/database"),
    ]);

    const msgRef = push(ref(db, `rooms/${roomId}/messages`));
    await set(msgRef, {
        uid: user.uid,
        name: getSafeDisplayName(user),
        text: cleanText,
        createdAt: serverTimestamp(),
    });
    return true;
};
