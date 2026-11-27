import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Users, Clapperboard } from "lucide-react";
import { localizeMovieMetaText } from "@lib/movieUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MovieInfoGrid = ({ movieInfo }) => {
    const { t, i18n } = useTranslation();

    const cleanContent = movieInfo.content
        ? movieInfo.content.replace(/<[^>]*>/g, "").trim()
        : "";
    const directors = (movieInfo.director || []).filter(Boolean);
    const actors = (movieInfo.actor || []).filter(Boolean);
    const countries = movieInfo.country || [];

    return (
        <div className="app-container mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clapperboard className="h-5 w-5 text-primary dark:text-rose-400" />
                                <span>{t("detail.synopsis")}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[15px] min-[2000px]:text-base leading-relaxed text-muted-foreground">
                                {cleanContent || t("detail.noSynopsis")}
                            </p>
                        </CardContent>
                    </Card>

                    {actors.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-primary dark:text-rose-400" />
                                    <span>{t("detail.cast")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {actors.map((actor, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="px-3 py-1.5 text-sm font-medium"
                                        >
                                            {actor}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {t("detail.movieInfo")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {directors.length > 0 && (
                                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span className="text-muted-foreground shrink-0">
                                        {t("detail.director")}
                                    </span>
                                    <span className="font-medium text-right text-foreground">
                                        {directors.join(", ")}
                                    </span>
                                </div>
                            )}

                            {countries.length > 0 && (
                                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                                        <Globe className="h-4 w-4" />
                                        {t("detail.country")}
                                    </span>
                                    <div className="flex flex-wrap justify-end gap-1.5">
                                        {countries.map((c) => (
                                            <Link
                                                key={c.id || c.slug}
                                                to={`/movies?country=${c.slug}`}
                                                className="font-medium text-primary dark:text-rose-400 hover:underline"
                                            >
                                                {c.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {movieInfo.year && (
                                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span className="text-muted-foreground">
                                        {t("detail.releaseYear")}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {movieInfo.year}
                                    </span>
                                </div>
                            )}

                            {movieInfo.time && (
                                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span className="text-muted-foreground">
                                        {t("detail.duration")}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {localizeMovieMetaText(movieInfo.time, i18n.language)}
                                    </span>
                                </div>
                            )}

                            {movieInfo.episode_current && (
                                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span className="text-muted-foreground">
                                        {t("detail.status")}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {localizeMovieMetaText(movieInfo.episode_current, i18n.language)}
                                        {movieInfo.episode_total > 1 &&
                                        !String(movieInfo.episode_current).includes("/")
                                            ? ` / ${movieInfo.episode_total}`
                                            : ""}
                                    </span>
                                </div>
                            )}

                            {movieInfo.lang && (
                                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span className="text-muted-foreground">
                                        {t("detail.language")}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {movieInfo.lang}
                                    </span>
                                </div>
                            )}

                            {typeof movieInfo.view === "number" && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        {t("detail.views")}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {movieInfo.view.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MovieInfoGrid;
