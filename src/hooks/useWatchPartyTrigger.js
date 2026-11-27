import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@context/AuthProvider";
import { hasPlayableHls } from "@lib/movieUtils";

export const useWatchPartyTrigger = (servers = []) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [createRoomOpen, setCreateRoomOpen] = useState(false);

    const canWatchParty = hasPlayableHls(servers);

    const openWatchParty = useCallback(() => {
        if (!user) {
            toast.info(t("room.loginRequiredToCreate"), {
                id: "room-login-required",
            });
            navigate("/sign-in", { state: { from: location } });
            return;
        }
        if (!canWatchParty) {
            toast.warning(t("room.hlsOnlyHint"), { id: "room-hls-only" });
            return;
        }
        setCreateRoomOpen(true);
    }, [user, canWatchParty, t, navigate, location]);

    return {
        canWatchParty,
        createRoomOpen,
        setCreateRoomOpen,
        openWatchParty,
    };
};
