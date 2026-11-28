import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { History, Play, X } from "lucide-react";
import { useWatchHistory } from "@context/WatchHistoryProvider";
import { normalizeImageUrl, optimizeImageUrl } from "@/services/api";
import { prefetchMovieDetail } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Img from "@components/Img";
import MovieCarouselRow from "@components/common/MovieCarouselRow";

const formatRemainingLabel = (currentTime, duration, t) => {
    if (!Number.isFinite(duration) || duration <= 0) return "";
    const remainingMin = Math.max(1, Math.ceil((duration - currentTime) / 60));
    return t("history.remainingMin", { count: remainingMin });
};

const ContinueWatching = () => {
    const { t } = useTranslation();
    const { history, removeProgress } = useWatchHistory();

    const visibleItems = history.filter((item) => item?.slug && item?.currentTime > 5);
    if (visibleItems.length === 0) return null;

    return (
        <section className="w-full cv-auto" aria-label={t("history.continueWatching")}>
            <div className="mb-4 sm:mb-5 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-3 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-primary to-amber-500" />
                    <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl min-[2000px]:text-3xl">
                        <History className="h-5 w-5 text-primary dark:text-rose-400" />
                        <span>{t("history.continueWatching")}</span>
                    </h2>
                </div>
            </div>

            <MovieCarouselRow>
                {visibleItems.map((item) => {
                    const percent =
                        item.duration > 0
                            ? Math.min(98, Math.max(4, Math.round((item.currentTime / item.duration) * 100)))
                            : 8;
                    const epQuery =
                        item.serverIdx > 0 || item.episodeIndex > 0
                            ? `?srv=${item.serverIdx + 1}&ep=${item.episodeIndex + 1}`
                            : "";
                    const watchPath = `/watch/${item.slug}${epQuery}`;
                    const remainingText = formatRemainingLabel(item.currentTime, item.duration, t);
                    const episodeBadge = item.episodeName || (item.episodeIndex > 0 ? `${t("watch.episodePrefix")} ${item.episodeIndex + 1}` : "");

                    return (
                        <div
                            key={item.movieId || item.slug}
                            className="group/cw relative w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-[22.5vw] lg:w-[19vw] xl:w-[15.7%]"
                        >
                            <Link
                                to={watchPath}
                                onMouseEnter={() => prefetchMovieDetail(item.slug)}
                                onFocus={() => prefetchMovieDetail(item.slug)}
                                className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <Card className="relative flex h-full flex-col overflow-hidden rounded-xl border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 dark:shadow-none">
                                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                                        <Img
                                            src={optimizeImageUrl(item.posterUrl, { width: 400 })}
                                            fallbackSrc={normalizeImageUrl(item.posterUrl)}
                                            width={200}
                                            height={300}
                                            fetchPriority="low"
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/cw:scale-105"
                                        />

                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                                        {episodeBadge && (
                                            <Badge className="pointer-events-none absolute left-2 top-2 z-10 border-none bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                                                {episodeBadge}
                                            </Badge>
                                        )}

                                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/cw:opacity-100">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
                                                <Play className="ml-0.5 h-5 w-5 fill-current" />
                                            </div>
                                        </div>

                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1.5 bg-white/25">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between gap-1.5 p-3">
                                        <h3 className="line-clamp-1 text-sm font-bold text-card-foreground group-hover/cw:text-primary dark:group-hover/cw:text-rose-400">
                                            {item.name}
                                        </h3>
                                        {remainingText && (
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {remainingText}
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            </Link>

                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                aria-label={t("history.removeItem")}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    void removeProgress(item.movieId);
                                }}
                                className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full border border-white/15 bg-black/75 text-white opacity-90 shadow-md backdrop-blur-md transition-opacity hover:bg-destructive hover:text-white md:opacity-0 md:group-hover/cw:opacity-100 focus-visible:opacity-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    );
                })}
            </MovieCarouselRow>
        </section>
    );
};

export default ContinueWatching;
