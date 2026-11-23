import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/60 relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
