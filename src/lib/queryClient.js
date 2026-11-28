import { QueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/api";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export const queryKeys = {
    newUpdated: (page = 1, version = "v1") => ["movies", "new-updated", version, page],
    byType: (typeSlug, params = {}) => ["movies", "by-type", typeSlug, params],
    catalog: (filters) => ["movies", "catalog", filters],
    detail: (slug) => ["movies", "detail", slug],
    byCategory: (slug, params = {}) => ["movies", "by-category", slug, params],
    categories: () => ["meta", "categories"],
    countries: () => ["meta", "countries"],
    years: () => ["meta", "years"],
};

/**
 * Prefetches movie detail data on link hover/focus to speed up navigation.
 */
export const prefetchMovieDetail = (slug) => {
    if (!slug) return;
    void queryClient.prefetchQuery({
        queryKey: queryKeys.detail(slug),
        queryFn: () => movieService.getMovieDetail(slug),
        staleTime: 2 * 60 * 1000,
    });
};
