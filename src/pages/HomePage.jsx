import FeatureMovies from "@/components/FeatureMovies/index.jsx";
import { TRENDING_TABS, TOP_RATED_TABS } from "../libs/constants.js";
import MediaList from "@/components/MediaList/index.jsx";

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
