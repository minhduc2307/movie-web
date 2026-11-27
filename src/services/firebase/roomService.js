import { getRtdb } from "@/lib/firebase/database";
import { getSafeDisplayName } from "@/lib/userUtils";
import { MAX_ROOM_MEMBERS } from "@/features/watch-party/lib/constants";

export const createRoom = async ({
    user,
    movie,
    serverIdx = 0,
    episodeIndex = 0,
    clientId,
}) => {
    const [db, { push, ref, serverTimestamp, set }] = await Promise.all([
        getRtdb(),
        import("firebase/database"),
    ]);

    const roomsRef = ref(db, "rooms");
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key;
    const displayName = getSafeDisplayName(user);

    await set(newRoomRef, {
        meta: {
            hostUid: user.uid,
            movieSlug: String(movie.slug || "").slice(0, 200),
            movieName: String(movie.name || "Watch Party").slice(0, 300),
            posterUrl: String(movie.posterUrl || movie.poster_url || "/NoImage.svg").slice(0, 500),
            createdAt: serverTimestamp(),
        },
        media: {
            serverIdx: Number(serverIdx) || 0,
            episodeIndex: Number(episodeIndex) || 0,
            updatedBy: user.uid,
            updatedAt: serverTimestamp(),
        },
        playback: {
            state: "paused",
            position: 0,
            updatedBy: user.uid,
            updatedByName: displayName,
            updatedAt: serverTimestamp(),
            clientId,
        },
        slots: {
            0: {
                uid: user.uid,
                name: displayName,
                joinedAt: serverTimestamp(),
            },
        },
    });

    return roomId;
};

export const subscribeRoomChannel = async (roomId, callbacks) => {
    const [db, { onValue, ref }] = await Promise.all([
        getRtdb(),
        import("firebase/database"),
    ]);

    const unsubscribers = [
        onValue(
            ref(db, `rooms/${roomId}/meta`),
            (snap) => callbacks.onMeta?.(snap.exists() ? snap.val() : null),
            (err) => callbacks.onError?.(err)
        ),
        onValue(ref(db, `rooms/${roomId}/media`), (snap) => {
            if (snap.exists()) callbacks.onMedia?.(snap.val());
        }),
        onValue(ref(db, `rooms/${roomId}/playback`), (snap) => {
            if (snap.exists()) callbacks.onPlayback?.(snap.val());
        }),
        onValue(ref(db, `rooms/${roomId}/slots`), (snap) => {
            callbacks.onSlots?.(snap.exists() ? snap.val() : {});
        }),
        onValue(ref(db, ".info/serverTimeOffset"), (snap) => {
            callbacks.onServerOffset?.(Number(snap.val()) || 0);
        }),
        onValue(ref(db, ".info/connected"), (snap) => {
            callbacks.onConnected?.(Boolean(snap.val()));
        }),
    ];

    return () => {
        unsubscribers.forEach((unsub) => unsub());
    };
};

export const claimRoomSlot = async ({ roomId, user }) => {
    const [db, { get, onDisconnect, ref, runTransaction, serverTimestamp }] =
        await Promise.all([getRtdb(), import("firebase/database")]);

    const slotsSnap = await get(ref(db, `rooms/${roomId}/slots`));
    const currentSlots = slotsSnap.exists() ? slotsSnap.val() : {};
    const displayName = getSafeDisplayName(user);

    const candidateIndices = [];
    for (let i = 0; i < MAX_ROOM_MEMBERS; i += 1) {
        if (currentSlots?.[i]?.uid === user.uid) {
            candidateIndices.push(i);
        }
    }
    for (let i = 0; i < MAX_ROOM_MEMBERS; i += 1) {
        if (!candidateIndices.includes(i) && !currentSlots?.[i]) {
            candidateIndices.push(i);
        }
    }

    for (const slotIndex of candidateIndices) {
        const slotRef = ref(db, `rooms/${roomId}/slots/${slotIndex}`);
        const txResult = await runTransaction(
            slotRef,
            (existing) => {
                if (existing !== null && existing.uid !== user.uid) {
                    return;
                }
                return {
                    uid: user.uid,
                    name: displayName,
                    joinedAt: serverTimestamp(),
                };
            },
            { applyLocally: false }
        );

        if (txResult.committed) {
            const disconnectHandle = onDisconnect(slotRef);
            await disconnectHandle.remove();
            return {
                status: "claimed",
                slotIndex,
                release: async () => {
                    await disconnectHandle.cancel().catch(() => {});
                    await runTransaction(slotRef, (curr) =>
                        curr?.uid === user.uid ? null : undefined
                    ).catch(() => {});
                },
                cancelDisconnectOnly: async () => {
                    await disconnectHandle.cancel().catch(() => {});
                },
            };
        }
    }

    return { status: "full" };
};

export const writeRoomPlayback = async ({
    roomId,
    state,
    position,
    user,
    clientId,
}) => {
    const [db, { ref, serverTimestamp, set }] = await Promise.all([
        getRtdb(),
        import("firebase/database"),
    ]);

    await set(ref(db, `rooms/${roomId}/playback`), {
        state: state === "playing" ? "playing" : "paused",
        position: Math.max(0, Number(position) || 0),
        updatedBy: user.uid,
        updatedByName: getSafeDisplayName(user),
        updatedAt: serverTimestamp(),
        clientId,
    });
};

export const switchRoomMedia = async ({
    roomId,
    serverIdx,
    episodeIndex,
    user,
    clientId,
}) => {
    const [db, { ref, serverTimestamp, update }] = await Promise.all([
        getRtdb(),
        import("firebase/database"),
    ]);

    await update(ref(db, `rooms/${roomId}`), {
        media: {
            serverIdx: Number(serverIdx) || 0,
            episodeIndex: Number(episodeIndex) || 0,
            updatedBy: user.uid,
            updatedAt: serverTimestamp(),
        },
        playback: {
            state: "paused",
            position: 0,
            updatedBy: user.uid,
            updatedByName: getSafeDisplayName(user),
            updatedAt: serverTimestamp(),
            clientId,
        },
    });
};

export const closeRoom = async (roomId) => {
    const [db, { ref, remove }] = await Promise.all([
        getRtdb(),
        import("firebase/database"),
    ]);
    await remove(ref(db, `rooms/${roomId}`));
};
