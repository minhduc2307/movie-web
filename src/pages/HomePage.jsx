import FeatureMovies from "@components/FeatureMovies";
import MediaList from "@components/MediaList";
import { TABS } from "@libs/constants";

function HomePage() {
    return (
        <div>
            <FeatureMovies />
            <MediaList tab={TABS[0]} />
            <MediaList tab={TABS[1]} />
            <MediaList tab={TABS[2]} />
            <MediaList tab={TABS[3]} />
        </div>
    );
}

export default HomePage;
