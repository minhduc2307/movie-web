import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MAX_ROOM_MEMBERS } from "@/features/watch-party/lib/constants";
import { claimRoomSlot } from "@/services/firebase/roomService";

const countOccupiedSlots = (slots = {}) => {
    let count = 0;
    for (let i = 0; i < MAX_ROOM_MEMBERS; i += 1) {
        if (slots?.[i]?.uid) count += 1;
    }
    return count;
};

export const useRoomSlot = ({ roomId, user, roomStatus, slots, isConnected }) => {
    const [slotStatus, setSlotStatus] = useState("idle");
    const [mySlotIndex, setMySlotIndex] = useState(null);
    const [claimRetryTick, setClaimRetryTick] = useState(0);

    const uid = user?.uid || null;
    const handleRef = useRef(null);
    const claimingRef = useRef(false);
    const isMountedRef = useRef(true);
    const slotStatusRef = useRef(slotStatus);
    slotStatusRef.current = slotStatus;

    const activeTargetRef = useRef({ roomId, uid });
    activeTargetRef.current = { roomId, uid };

    const occupiedCount = useMemo(() => countOccupiedSlots(slots), [slots]);

    const releaseSlot = useCallback(async () => {
        const handle = handleRef.current;
        handleRef.current = null;
        setMySlotIndex(null);
        setSlotStatus("idle");
        if (handle?.release) {
            await handle.release();
        }
    }, []);

    const cancelDisconnectOnly = useCallback(async () => {
        const handle = handleRef.current;
        handleRef.current = null;
        setMySlotIndex(null);
        setSlotStatus("idle");
        if (handle?.cancelDisconnectOnly) {
            await handle.cancelDisconnectOnly();
        }
    }, []);

    const isStillOccupyingSlot =
        mySlotIndex !== null && Boolean(uid) && slots?.[mySlotIndex]?.uid === uid;

    // If the room was full and a seat opens up later, clear "full" so the user can auto-claim
    useEffect(() => {
        if (
            roomStatus === "active" &&
            slotStatus === "full" &&
            occupiedCount < MAX_ROOM_MEMBERS
        ) {
            setSlotStatus("idle");
        }
    }, [roomStatus, slotStatus, occupiedCount]);

    useEffect(() => {
        if (
            roomStatus === "closed" ||
            roomStatus === "not_found" ||
            roomStatus === "error"
        ) {
            const handle = handleRef.current;
            handleRef.current = null;
            handle?.cancelDisconnectOnly?.();
            setMySlotIndex(null);
            if (roomStatus !== "error") {
                setSlotStatus("idle");
            }
            return;
        }

        if (
            roomStatus !== "active" ||
            !uid ||
            !roomId ||
            !isConnected ||
            isStillOccupyingSlot ||
            claimingRef.current ||
            slotStatus === "full" ||
            slotStatus === "error"
        ) {
            return;
        }

        claimingRef.current = true;
        setSlotStatus("claiming");
        const targetRoomId = roomId;
        const targetUid = uid;
        let settledTerminalStatus = false;

        claimRoomSlot({ roomId, user })
            .then((result) => {
                const isSameTarget =
                    activeTargetRef.current.roomId === targetRoomId &&
                    activeTargetRef.current.uid === targetUid;

                if (!isMountedRef.current || !isSameTarget) {
                    if (result.status === "claimed") {
                        result.release?.();
                    }
                    return;
                }

                if (result.status === "claimed") {
                    handleRef.current = result;
                    setMySlotIndex(result.slotIndex);
                    setSlotStatus("claimed");
                } else {
                    settledTerminalStatus = true;
                    setMySlotIndex(null);
                    setSlotStatus("full");
                }
            })
            .catch((err) => {
                if (import.meta.env.DEV) {
                    console.error("[useRoomSlot] Failed to claim slot:", err);
                }
                if (
                    activeTargetRef.current.roomId === targetRoomId &&
                    activeTargetRef.current.uid === targetUid
                ) {
                    settledTerminalStatus = true;
                    setSlotStatus("error");
                }
            })
            .finally(() => {
                claimingRef.current = false;
                if (
                    !settledTerminalStatus &&
                    activeTargetRef.current.roomId === targetRoomId &&
                    activeTargetRef.current.uid === targetUid
                ) {
                    setClaimRetryTick((tick) => tick + 1);
                }
            });
    }, [
        roomId,
        uid,
        user,
        roomStatus,
        isConnected,
        isStillOccupyingSlot,
        slotStatus,
        claimRetryTick,
    ]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            const handle = handleRef.current;
            handleRef.current = null;
            handle?.release?.();
        };
    }, [roomId, uid]);

    return {
        mySlotIndex,
        slotStatus,
        isMember: slotStatus === "claimed",
        releaseSlot,
        cancelDisconnectOnly,
    };
};
