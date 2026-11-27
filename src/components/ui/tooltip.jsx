import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
    ({ className, sideOffset = 4, container, ...props }, ref) => (
        <TooltipPrimitive.Portal container={container}>
            <TooltipPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 origin-[--radix-tooltip-content-transform-origin] overflow-hidden rounded-md border border-slate-700/80 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:border-white/20 dark:bg-slate-800 dark:text-slate-50 animate-in zoom-in-95 duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
                    className,
                )}
                {...props}
            />
        </TooltipPrimitive.Portal>
    ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
