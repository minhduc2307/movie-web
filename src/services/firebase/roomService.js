import { getRtdb } from "@/lib/firebase/database";
import { getSafeDisplayName } from "@/lib/userUtils";
import {
    MAX_ROOM_MEMBERS,
    ROOM_CLEANUP_COOLDOWN_MS,
    ROOM_STALE_TTL_MS,
} from "@/features/watch-party/lib/constants";

const CLEANUP_SESSION_PREFIX = "wp_host_cleanup_at_";

/**
 * Checks whether any member currently occupies a seat in the room slots map.
 */
export const hasOccupiedSlots = (slots = {}) => {
    for (let i = 0; i < MAX_ROOM_MEMBERS; i += 1) {
        if (slots?.[i]?.uid) return true;
    }
    return false;
};

/**
 * Checks whether any user other than `uid` currently holds a seat in the room.
 */
export const hasOtherOccupiedSlots = (slots = {}, uid) => {
    for (let i = 0; i < MAX_ROOM_MEMBERS; i += 1) {
        const occupantUid = slots?.[i]?.uid;
        if (occupantUid && occupantUid !== uid) return true;
    }
    return false;
};

const getRoomLastActivityAt = (roomData = {}) =>
    Math.max(
        Number(roomData?.meta?.createdAt) || 0,
        Number(roomData?.playback?.updatedAt) || 0,
        Number(roomData?.media?.updatedAt) || 0
    );

/**
 * Removes abandoned empty rooms owned by `hostUid` whose last activity exceeded `maxAgeMs`.
 * Safe no-op on offline errors or if host-scoped RTDB query rules are not yet published.
 */
export const cleanupStaleHostRooms = async (
    hostUid,
    { excludeRoomId = null, maxAgeMs = ROOM_STALE_TTL_MS, force = false } = {}
) => {
    if (!hostUid) return 0;

    const sessionKey = `${CLEANUP_SESSION_PREFIX}${hostUid}`;
    if (!force && typeof sessionStorage !== "undefined") {
        try {
            const lastRun = Number(sessionStorage.getItem(sessionKey) || 0);
            if (lastRun > 0 && Date.now() - lastRun < ROOM_CLEANUP_COOLDOWN_MS) {
                return 0;
            }
            sessionStorage.setItem(sessionKey, String(Date.now()));
        } catch {
            // Ignore storage errors in restricted contexts
        }
    }

    try {
        const [db, { equalTo, get, orderByChild, query, ref, remove }] =
            await Promise.all([getRtdb(), import("firebase/database")]);

        const [roomsSnap, offsetSnap] = await Promise.all([
            get(query(ref(db, "rooms"), orderByChild("meta/hostUid"), equalTo(hostUid))),
            get(ref(db, ".info/serverTimeOffset")).catch(() => null),
        ]);

        if (!roomsSnap.exists()) return 0;

        const serverOffset = Number(offsetSnap?.val()) || 0;
        const serverNow = Date.now() + serverOffset;
        const removals = [];

        roomsSnap.forEach((childSnap) => {
            const staleRoomId = childSnap.key;
            if (!staleRoomId || staleRoomId === excludeRoomId) return;

            const roomData = childSnap.val();
            if (!roomData || hasOccupiedSlots(roomData.slots)) return;

            const lastActivityAt = getRoomLastActivityAt(roomData);
            if (!lastActivityAt || serverNow - lastActivityAt >= maxAgeMs) {
                removals.push(
                    remove(ref(db, `rooms/${staleRoomId}`)).catch(() => null)
                );
            }
        });

        await Promise.all(removals);
        return removals.length;
    } catch {
        return 0;
    }
};

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

    // Sweep abandoned empty rooms hosted previously by this user in the background
    void cleanupStaleHostRooms(user.uid, {
        excludeRoomId: roomId,
        force: true,
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

/**
 * Leaves a room cleanly and deletes the room node when the leaving user is the last occupant.
 * Falls back to slot release if room removal is rejected by older database rules.
 */
export const leaveOrCleanupRoom = async ({
    roomId,
    user,
    slots,
    releaseSlot,
    cancelDisconnectOnly,
}) => {
    const uid = user?.uid;
    const isLastOccupant = Boolean(uid) && !hasOtherOccupiedSlots(slots, uid);

    if (roomId && isLastOccupant) {
        try {
            await closeRoom(roomId);
            await cancelDisconnectOnly?.();
            return;
        } catch {
            // Fall back to releasing the user's slot if full room removal fails
        }
    }

    await releaseSlot?.();
};
