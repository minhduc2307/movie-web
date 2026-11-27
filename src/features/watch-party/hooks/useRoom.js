import { useEffect, useMemo, useRef, useState } from "react";
import { MAX_ROOM_MEMBERS } from "@/features/watch-party/lib/constants";
import { subscribeRoomChannel } from "@/services/firebase/roomService";

export const useRoom = (roomId) => {
    const [meta, setMeta] = useState(null);
    const [media, setMedia] = useState(null);
    const [playback, setPlayback] = useState(null);
    const [slots, setSlots] = useState({});
    const [roomStatus, setRoomStatus] = useState("loading");
    const [isConnected, setIsConnected] = useState(true);

    const hadMetaRef = useRef(false);
    const hasConnectedOnceRef = useRef(false);
    const serverOffsetRef = useRef(0);

    useEffect(() => {
        if (!roomId) {
            setRoomStatus("not_found");
            return;
        }

        let cancelled = false;
        let unsubscribe = null;

        hadMetaRef.current = false;
        hasConnectedOnceRef.current = false;
        setRoomStatus("loading");
        setMeta(null);
        setMedia(null);
        setPlayback(null);
        setSlots({});

        subscribeRoomChannel(roomId, {
            onMeta: (nextMeta) => {
                if (cancelled) return;
                if (nextMeta) {
                    hadMetaRef.current = true;
                    setMeta(nextMeta);
                    setRoomStatus("active");
                } else {
                    setMeta(null);
                    setRoomStatus(hadMetaRef.current ? "closed" : "not_found");
                }
            },
            onMedia: (nextMedia) => {
                if (!cancelled) setMedia(nextMedia);
            },
            onPlayback: (nextPlayback) => {
                if (!cancelled) setPlayback(nextPlayback);
            },
            onSlots: (nextSlots) => {
                if (!cancelled) setSlots(nextSlots || {});
            },
            onServerOffset: (offset) => {
                serverOffsetRef.current = offset;
            },
            onConnected: (connected) => {
                if (cancelled) return;
                if (connected) {
                    hasConnectedOnceRef.current = true;
                    setIsConnected(true);
                } else if (hasConnectedOnceRef.current) {
                    setIsConnected(false);
                }
            },
            onError: (err) => {
                if (import.meta.env.DEV) {
                    console.error("[useRoom] Channel error:", err);
                }
                if (!cancelled) setRoomStatus("error");
            },
        })
            .then((unsub) => {
                if (cancelled) {
                    unsub?.();
                } else {
                    unsubscribe = unsub;
                }
            })
            .catch(() => {
                if (!cancelled) setRoomStatus("error");
            });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [roomId]);

    const memberSlots = useMemo(() => {
        const list = [];
        for (let i = 0; i < MAX_ROOM_MEMBERS; i += 1) {
            list.push({
                slotIndex: i,
                member: slots?.[i] || null,
            });
        }
        return list;
    }, [slots]);

    const memberCount = useMemo(
        () => memberSlots.filter((item) => Boolean(item.member?.uid)).length,
        [memberSlots]
    );

    return {
        meta,
        media,
        playback,
        slots,
        memberSlots,
        memberCount,
        roomStatus,
        isConnected,
        serverOffsetRef,
    };
};
