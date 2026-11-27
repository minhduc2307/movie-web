import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Lightweight wrapper over shadcn Tooltip to provide consistent tooltips
 * on icon-only controls across the application.
 */
const AppTooltip = ({
    label,
    children,
    side = "bottom",
    sideOffset = 6,
    container,
    className,
}) => {
    if (!label) return children;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side} sideOffset={sideOffset} container={container} className={className}>
                {label}
            </TooltipContent>
        </Tooltip>
    );
};

export default AppTooltip;
