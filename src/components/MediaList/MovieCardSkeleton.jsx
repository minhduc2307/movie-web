import { Skeleton } from "@/components/ui/skeleton";

const MovieCardSkeleton = () => {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card/40 p-2 sm:p-2.5">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="pt-2.5 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-10 rounded" />
                    <Skeleton className="h-3.5 w-16 rounded" />
                </div>
            </div>
        </div>
    );
};

export default MovieCardSkeleton;
