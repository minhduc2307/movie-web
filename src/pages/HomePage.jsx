import FeatureMovies from "@components/FeatureMovies";
import MediaList from "@components/MediaList";
import { TABS } from "@libs/constants";

function HomePage() {
    return (
        <div>
            <FeatureMovies />
            <div className="min-h-screen bg-[#292e39]">
                <MediaList tab={TABS[0]} />
                <MediaList tab={TABS[1]} />
                <MediaList tab={TABS[2]} />
                <MediaList tab={TABS[3]} />
            </div>
        </div>
    );
}

export default HomePage;
