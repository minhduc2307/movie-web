import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
    return (
        <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[72vh] lg:min-h-[580px] lg:max-h-[760px] overflow-hidden bg-muted/20">
            {/* Shimmer background */}
            <div className="absolute inset-0 animate-pulse bg-muted/40" />

            {/* Vignette gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent sm:w-4/5 lg:w-3/5" />

            {/* Content placeholder */}
            <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
                <div className="max-w-2xl space-y-4">
                    {/* Badges row */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-12 rounded-md" />
                        <Skeleton className="h-6 w-14 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                    </div>

                    {/* Title */}
                    <Skeleton className="h-10 sm:h-14 lg:h-16 w-3/4 rounded-lg" />

                    {/* Subtitle / Origin Name */}
                    <Skeleton className="h-5 w-1/2 rounded" />

                    {/* Description */}
                    <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-4/5 rounded" />
                    </div>

                    {/* CTA buttons */}
                    <div className="flex items-center gap-3 pt-3">
                        <Skeleton className="h-11 w-32 rounded-lg" />
                        <Skeleton className="h-11 w-40 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSkeleton;
