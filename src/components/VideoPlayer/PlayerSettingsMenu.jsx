import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Settings,
    Check,
    ChevronLeft,
    ChevronRight,
    Gauge,
    SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import PlayerIconButton from "./PlayerIconButton";
import { PLAYBACK_RATES } from "./playerUtils";

const SettingsOptionList = ({ title, options, selectedValue, onBack, onSelect }) => (
    <div>
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-1 h-8 w-full justify-start gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white"
        >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{title}</span>
        </Button>
        <Separator className="mb-1 bg-white/10" />
        <ScrollArea className="max-h-48">
            <div className="space-y-0.5 pr-1">
                {options.map((opt) => (
                    <Button
                        key={opt.value}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelect(opt.value)}
                        className="h-8 w-full justify-between rounded-lg px-2.5 text-xs font-normal text-white hover:bg-white/10 hover:text-white"
                    >
                        <span>{opt.label}</span>
                        {selectedValue === opt.value && (
                            <Check className="h-3.5 w-3.5 text-primary dark:text-rose-400" />
                        )}
                    </Button>
                ))}
            </div>
        </ScrollArea>
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
    portalContainer,
}) => {
    const { t } = useTranslation();
    const [panel, setPanel] = useState("main");

    const hasQualityOptions = Array.isArray(levels) && levels.length > 0;
    const hasAnyOption = hasQualityOptions || allowSpeedControl;

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

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) setPanel("main");
        onOpenChange(nextOpen);
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <PlayerIconButton
                    label={t("watch.player.settings")}
                    portalContainer={portalContainer}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(isOpen && "bg-white/20 text-white")}
                >
                    <Settings
                        className={cn(
                            "h-[18px] w-[18px] transition-transform duration-300",
                            isOpen && "rotate-45"
                        )}
                    />
                </PlayerIconButton>
            </PopoverTrigger>

            <PopoverContent
                container={portalContainer}
                align="end"
                side="top"
                sideOffset={24}
                collisionPadding={16}
                onClick={(e) => e.stopPropagation()}
                className="z-40 w-56 overflow-hidden rounded-xl border-white/15 bg-[#0d111c]/95 p-1.5 text-sm text-white shadow-2xl backdrop-blur-xl"
            >
                {panel === "main" && (
                    <div role="menu" className="space-y-0.5">
                        {hasQualityOptions && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setPanel("quality")}
                                className="h-9 w-full justify-between rounded-lg px-2.5 text-left font-normal hover:bg-white/10 hover:text-white"
                            >
                                <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
                                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                                    {t("watch.player.quality")}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-semibold text-white">
                                    {currentQualityLabel}
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                </span>
                            </Button>
                        )}

                        {allowSpeedControl && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setPanel("speed")}
                                className="h-9 w-full justify-between rounded-lg px-2.5 text-left font-normal hover:bg-white/10 hover:text-white"
                            >
                                <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
                                    <Gauge className="h-3.5 w-3.5 text-slate-400" />
                                    {t("watch.player.speed")}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-semibold text-white">
                                    {currentSpeedLabel}
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                </span>
                            </Button>
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
                            handleOpenChange(false);
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
                            handleOpenChange(false);
                        }}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};

export default PlayerSettingsMenu;
