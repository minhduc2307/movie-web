import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clapperboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { movieService } from "@/services/api";
import { Facebook, Youtube, Twitter, Instagram } from "./SocialIcons";

const FEATURED_GENRE_SLUGS = [
    "chinh-kich",
    "tam-ly",
    "hanh-dong",
    "hai-huoc",
    "tinh-cam",
    "vien-tuong",
];

const DEFAULT_FEATURED_GENRES = [
    { name: "Chính Kịch", slug: "chinh-kich" },
    { name: "Tâm Lý", slug: "tam-ly" },
    { name: "Hành Động", slug: "hanh-dong" },
    { name: "Hài Hước", slug: "hai-huoc" },
    { name: "Tình Cảm", slug: "tinh-cam" },
    { name: "Viễn Tưởng", slug: "vien-tuong" },
];

const GENRE_EN_MAP = {
    "chinh-kich": "Drama",
    "tam-ly": "Psychological",
    "hanh-dong": "Action",
    "hai-huoc": "Comedy",
    "tinh-cam": "Romance",
    "vien-tuong": "Sci-Fi",
    "kinh-di": "Horror",
    "co-trang": "Historical",
    "phieu-luu": "Adventure",
    "hinh-su": "Crime",
    "bi-an": "Mystery",
    "khoa-hoc": "Science",
    "gia-dinh": "Family",
    "chien-tranh": "War",
};

const SUPPORT_TOPIC_KEYS = [
    "footer.topicDmca",
    "footer.topicTerms",
    "footer.topicPrivacy",
    "footer.topicAds",
    "footer.topicFeedback",
];

const SOCIAL_LINKS = [
    { name: "Facebook", href: "https://facebook.com", Icon: Facebook },
    { name: "Youtube", href: "https://youtube.com", Icon: Youtube },
    { name: "Twitter", href: "https://twitter.com", Icon: Twitter },
    { name: "Instagram", href: "https://instagram.com", Icon: Instagram },
];

const selectFeaturedGenres = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return DEFAULT_FEATURED_GENRES;

    const bySlug = new Map(items.map((item) => [item.slug, item]));
    const picked = [];

    for (const slug of FEATURED_GENRE_SLUGS) {
        const matched = bySlug.get(slug);
        if (matched) picked.push({ name: matched.name, slug: matched.slug });
    }

    for (const item of items) {
        if (picked.length >= FEATURED_GENRE_SLUGS.length) break;
        if (!picked.some((g) => g.slug === item.slug)) {
            picked.push({ name: item.name, slug: item.slug });
        }
    }

    return picked.length > 0 ? picked : DEFAULT_FEATURED_GENRES;
};

const Footer = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState("");
    const [featuredGenres, setFeaturedGenres] = useState(DEFAULT_FEATURED_GENRES);

    useEffect(() => {
        let isMounted = true;
        movieService
            .getCategories()
            .then((res) => {
                if (!isMounted) return;
                setFeaturedGenres(selectFeaturedGenres(res?.data?.items));
            })
            .catch(() => {
                // Keep API-aligned fallback genres silently
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const exploreLinks = [
        { label: t("nav.newMovies"), to: "/movies" },
        { label: t("nav.singleMovies"), to: "/movies?type=phim-le" },
        { label: t("nav.series"), to: "/movies?type=phim-bo" },
        { label: t("nav.anime"), to: "/movies?type=hoat-hinh" },
        { label: t("nav.tvShows"), to: "/movies?type=tv-shows" },
        { label: t("nav.theaterMovies"), to: "/movies?type=phim-chieu-rap" },
    ];

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        toast.success(t("footer.newsletterSuccess"));
        setEmail("");
    };

    const isEnglish = i18n.language === "en";

    return (
        <footer className="w-full border-t border-border/60 bg-card/30 text-muted-foreground transition-colors">
            <div className="app-container py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="space-y-4 lg:col-span-4">
                        <Link
                            to="/"
                            className="group flex w-fit items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-700 text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
                                <Clapperboard className="h-5 w-5" />
                            </div>
                            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-red-400 dark:via-rose-400 dark:to-amber-400">
                                {t("brand.name")}
                            </span>
                        </Link>

                        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                            {t("brand.description")}
                        </p>

                        <div className="max-w-md rounded-lg border border-border/70 bg-muted/40 p-3.5 text-[13px] leading-relaxed text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                {t("brand.dmcaTitle")}{" "}
                            </span>
                            {t("brand.dmcaContent")}
                        </div>

                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="max-w-md space-y-2 pt-1"
                        >
                            <label
                                htmlFor="newsletter-email"
                                className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                            >
                                {t("footer.newsletterLabel")}
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="newsletter-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder={t(
                                        "footer.newsletterPlaceholder",
                                    )}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 border-border bg-background text-sm sm:h-10"
                                />
                                <Button
                                    type="submit"
                                    className="h-11 shrink-0 rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 sm:h-10"
                                >
                                    {t("footer.newsletterBtn")}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {t("footer.explore")}
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {exploreLinks.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="inline-block py-0.5 text-muted-foreground transition-colors hover:text-primary dark:hover:text-rose-400"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4 lg:col-span-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {t("footer.genres")}
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {featuredGenres.map((genre) => (
                                <li key={genre.slug}>
                                    <Link
                                        to={`/movies?category=${genre.slug}`}
                                        className="inline-block py-0.5 text-muted-foreground transition-colors hover:text-primary dark:hover:text-rose-400"
                                    >
                                        {isEnglish ? GENRE_EN_MAP[genre.slug] || genre.name : genre.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4 lg:col-span-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {t("footer.support")}
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {SUPPORT_TOPIC_KEYS.map((topicKey) => {
                                const topicLabel = t(topicKey);
                                return (
                                    <li key={topicKey}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toast.info(
                                                    t("footer.topicUpdating", {
                                                        topic: topicLabel,
                                                    }),
                                                )
                                            }
                                            className="inline-block py-0.5 text-left text-muted-foreground transition-colors hover:text-primary dark:hover:text-rose-400"
                                        >
                                            {topicLabel}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
                    <p className="text-center text-sm text-muted-foreground sm:text-left">
                        {t("footer.copyright")}
                    </p>

                    <div className="flex items-center gap-3">
                        {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 sm:h-9 sm:w-9"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
