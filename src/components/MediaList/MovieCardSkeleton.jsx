import { Skeleton } from "@/components/ui/skeleton";

const MovieCardSkeleton = () => {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm dark:shadow-none">
            <Skeleton className="aspect-[2/3] w-full rounded-none" />
            <div className="flex flex-1 flex-col justify-between gap-2.5 p-3 sm:p-3.5">
                <Skeleton className="h-[21px] sm:h-6 w-4/5 rounded" />
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 sm:h-[18px] w-10 rounded" />
                    <Skeleton className="h-4 sm:h-[18px] w-16 rounded" />
                </div>
            </div>
        </div>
    );
};

export default MovieCardSkeleton;
