import FeatureMovies from "@components/FeatureMovies";
import MediaList from "@components/MediaList";
import { TABS } from "@/lib/constants";

function HomePage() {
    return (
        <div className="bg-background text-foreground">
            <FeatureMovies />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14">
                {TABS.map((tab) => (
                    <MediaList key={tab.typeSlug} tab={tab} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
