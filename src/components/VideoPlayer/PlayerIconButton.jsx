import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/common";
import { cn } from "@/lib/utils";

/**
 * Circular icon control button used inside the cinema player toolbar.
 */
const PlayerIconButton = forwardRef(
    (
        {
            label,
            onClick,
            portalContainer,
            className,
            children,
            ...rest
        },
        ref
    ) => (
        <AppTooltip label={label} side="top" container={portalContainer}>
            <Button
                ref={ref}
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClick}
                aria-label={label}
                className={cn(
                    "h-9 w-9 rounded-full text-white/90 transition-all hover:bg-white/15 hover:text-white active:scale-95 focus-visible:ring-primary",
                    className
                )}
                {...rest}
            >
                {children}
            </Button>
        </AppTooltip>
    )
);

PlayerIconButton.displayName = "PlayerIconButton";

export default PlayerIconButton;
