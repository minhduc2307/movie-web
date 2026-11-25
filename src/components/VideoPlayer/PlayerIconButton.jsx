import { cn } from "@/lib/utils";

/**
 * Circular icon control button used inside the cinema player toolbar.
 */
const PlayerIconButton = ({
    label,
    onClick,
    className,
    children,
    ...rest
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/15 hover:text-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            className
        )}
        {...rest}
    >
        {children}
    </button>
);

export default PlayerIconButton;
