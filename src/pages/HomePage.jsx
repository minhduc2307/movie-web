import FeatureMovies from "../components/FeatureMovies";
import MediaList from "../components/MediaList";
import { TRENDING_TABS, TOP_RATED_TABS } from "../libs/constants.js";

function HomePage() {
    return (
        <div>
            <FeatureMovies />
            <MediaList title="Xếp hạng cao" tabs={TOP_RATED_TABS} />
            <MediaList title="Thịnh hành" tabs={TRENDING_TABS} />
        </div>
    );
}

export default HomePage;
