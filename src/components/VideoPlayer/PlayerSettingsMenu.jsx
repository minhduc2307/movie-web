import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Settings,
    Check,
    ChevronLeft,
    ChevronRight,
    Gauge,
    SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PlayerIconButton from "./PlayerIconButton";
import { PLAYBACK_RATES } from "./playerUtils";

const SettingsOptionList = ({ title, options, selectedValue, onBack, onSelect }) => (
    <div>
        <button
            type="button"
            onClick={onBack}
            className="mb-1 flex w-full items-center gap-1.5 border-b border-white/10 px-2 py-1.5 text-xs font-semibold text-slate-200 hover:text-white"
        >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{title}</span>
        </button>
        <div className="max-h-48 space-y-0.5 overflow-y-auto">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelect(opt.value)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-white/10"
                >
                    <span>{opt.label}</span>
                    {selectedValue === opt.value && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                </button>
            ))}
        </div>
    </div>
);

const PlayerSettingsMenu = ({
    levels,
    currentLevel,
    onSelectLevel,
    playbackRate,
    onSelectPlaybackRate,
    allowSpeedControl = true,
    isOpen,
    onOpenChange,
}) => {
    const { t } = useTranslation();
    const menuRef = useRef(null);
    const [panel, setPanel] = useState("main");

    const hasQualityOptions = Array.isArray(levels) && levels.length > 0;
    const hasAnyOption = hasQualityOptions || allowSpeedControl;

    useEffect(() => {
        if (!isOpen) {
            setPanel("main");
            return;
        }

        const handlePointerDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onOpenChange(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onOpenChange(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("keydown", handleKeyDown, true);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [isOpen, onOpenChange]);

    if (!hasAnyOption) return null;

    const qualityOptions = [
        { value: -1, label: t("watch.player.autoQuality") },
        ...levels.map((lvl) => ({ value: lvl.index, label: lvl.label })),
    ];

    const speedOptions = PLAYBACK_RATES.map((rate) => ({
        value: rate,
        label: rate === 1 ? t("watch.player.normalSpeed") : `${rate}x`,
    }));

    const currentQualityLabel =
        qualityOptions.find((opt) => opt.value === currentLevel)?.label ||
        t("watch.player.autoQuality");

    const currentSpeedLabel =
        playbackRate === 1 ? t("watch.player.normalSpeed") : `${playbackRate}x`;

    return (
        <div ref={menuRef} className="relative">
            <PlayerIconButton
                label={t("watch.player.settings")}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenChange(!isOpen);
                }}
                className={cn(isOpen && "bg-white/20 text-white")}
            >
                <Settings
                    className={cn(
                        "h-[18px] w-[18px] transition-transform duration-300",
                        isOpen && "rotate-45"
                    )}
                />
            </PlayerIconButton>

            {isOpen && (
                <div
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-12 right-0 z-40 w-56 overflow-hidden rounded-xl border border-white/15 bg-[#0d111c]/95 p-1.5 text-sm text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                >
                    {panel === "main" && (
                        <div className="space-y-0.5">
                            {hasQualityOptions && (
                                <button
                                    type="button"
                                    onClick={() => setPanel("quality")}
                                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/10"
                                >
                                    <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
                                        <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                                        {t("watch.player.quality")}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-semibold text-white">
                                        {currentQualityLabel}
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                    </span>
                                </button>
                            )}

                            {allowSpeedControl && (
                                <button
                                    type="button"
                                    onClick={() => setPanel("speed")}
                                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/10"
                                >
                                    <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
                                        <Gauge className="h-3.5 w-3.5 text-slate-400" />
                                        {t("watch.player.speed")}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-semibold text-white">
                                        {currentSpeedLabel}
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {panel === "quality" && (
                        <SettingsOptionList
                            title={t("watch.player.quality")}
                            options={qualityOptions}
                            selectedValue={currentLevel}
                            onBack={() => setPanel("main")}
                            onSelect={(lvlIndex) => {
                                onSelectLevel(lvlIndex);
                                onOpenChange(false);
                            }}
                        />
                    )}

                    {panel === "speed" && (
                        <SettingsOptionList
                            title={t("watch.player.speed")}
                            options={speedOptions}
                            selectedValue={playbackRate}
                            onBack={() => setPanel("main")}
                            onSelect={(rate) => {
                                onSelectPlaybackRate(rate);
                                onOpenChange(false);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default PlayerSettingsMenu;
