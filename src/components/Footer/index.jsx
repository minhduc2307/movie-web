import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clapperboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Facebook, Youtube, Twitter, Instagram } from "./SocialIcons";

const GENRE_LINKS = [
    { label: "Phim Hành Động", to: "/movies?category=hanh-dong" },
    { label: "Phim Cổ Trang", to: "/movies?category=co-trang" },
    { label: "Phim Tình Cảm", to: "/movies?category=tinh-cam" },
    { label: "Phim Viễn Tưởng", to: "/movies?category=vien-tuong" },
    { label: "Phim Kinh Dị", to: "/movies?category=kinh-di" },
];

const SUPPORT_TOPICS = [
    "Chính sách DMCA",
    "Điều khoản dịch vụ",
    "Chính sách quyền riêng tư",
    "Liên hệ hợp tác quảng cáo",
    "Báo cáo lỗi & Góp ý",
];

const SOCIAL_LINKS = [
    { name: "Facebook", href: "https://facebook.com", Icon: Facebook },
    { name: "Youtube", href: "https://youtube.com", Icon: Youtube },
    { name: "Twitter", href: "https://twitter.com", Icon: Twitter },
    { name: "Instagram", href: "https://instagram.com", Icon: Instagram },
];

const Footer = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const exploreLinks = [
        { label: t("catalog.title"), to: "/movies" },
        { label: t("nav.singleMovies"), to: "/movies?type=phim-le" },
        { label: t("nav.series"), to: "/movies?type=phim-bo" },
        { label: t("nav.anime"), to: "/movies?type=hoat-hinh" },
        { label: t("nav.tvShows"), to: "/movies?type=tv-shows" },
    ];

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        toast.success(t("footer.newsletterSuccess"));
        setEmail("");
    };

    return (
        <footer className="w-full border-t border-border/40 bg-card/20 text-muted-foreground transition-colors">
            <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5 space-y-4">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-600 text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
                                <Clapperboard className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                                {t("brand.name")}
                            </span>
                        </Link>

                        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                            {t("brand.description")}
                        </p>

                        <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 text-[13px] text-muted-foreground leading-relaxed max-w-md">
                            <span className="font-semibold text-foreground">{t("brand.dmcaTitle")} </span>
                            {t("brand.dmcaContent")}
                        </div>

                        <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1 max-w-md">
                            <label
                                htmlFor="newsletter-email"
                                className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                            >
                                {t("footer.newsletterLabel")}
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="newsletter-email"
                                    type="email"
                                    placeholder={t("footer.newsletterPlaceholder")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 bg-background/60 border-border/60 text-sm"
                                />
                                <Button
                                    type="submit"
                                    className="h-10 px-5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-md shadow-primary/20 rounded-lg"
                                >
                                    {t("footer.newsletterBtn")}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {t("footer.explore")}
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {exploreLinks.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {t("footer.genres")}
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {GENRE_LINKS.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {t("footer.support")}
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {SUPPORT_TOPICS.map((topic) => (
                                <li key={topic}>
                                    <button
                                        type="button"
                                        onClick={() => toast.info(`Thông tin "${topic}" đang được cập nhật.`)}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block text-left"
                                    >
                                        {topic}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
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
                                className="h-9 w-9 rounded-full border border-border/60 bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-110 active:scale-95"
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
