import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FeatureMovies from "@components/FeatureMovies";
import MediaList from "@components/MediaList";
import { TABS } from "@/lib/constants";

function HomePage() {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("brand.name");
    }, [t]);

    return (
        <div className="bg-background text-foreground">
            <FeatureMovies />
            <div className="app-container py-8 sm:py-12 space-y-10 sm:space-y-14">
                {TABS.map((tab, index) => (
                    <MediaList key={tab.typeSlug} tab={tab} deferLoad={index > 0} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
