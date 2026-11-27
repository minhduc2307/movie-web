import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
    return (
        <div className="px-4 pt-3 sm:p-0 bg-background">
            <div className="relative w-full aspect-[3/4] max-h-[540px] sm:aspect-auto sm:max-h-none sm:h-[580px] lg:h-[72vh] lg:min-h-[580px] lg:max-h-[760px] 2xl:max-h-[840px] overflow-hidden rounded-2xl sm:rounded-none bg-muted/20">
                <div className="absolute inset-0 animate-pulse bg-muted/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent sm:w-4/5 lg:w-3/5" />

                <div className="app-container relative z-20 flex h-full flex-col justify-end pb-16 sm:px-20 lg:px-20 2xl:px-24">
                    <div className="max-w-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-12 rounded-md" />
                            <Skeleton className="h-6 w-14 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>

                        <Skeleton className="h-10 sm:h-14 lg:h-16 w-3/4 rounded-lg" />
                        <Skeleton className="h-5 w-1/2 rounded" />

                        <div className="space-y-2 pt-1">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-4/5 rounded" />
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <Skeleton className="h-11 w-32 rounded-lg" />
                            <Skeleton className="h-11 w-40 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSkeleton;
