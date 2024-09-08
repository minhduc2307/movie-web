import FeatureMovies from "../components/FeatureMovies";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MediaList from "../components/MediaList";
import { TRENDING_TABS, TOP_RATED_TABS } from "../libs/constants";

function HomePage() {
    return (
        <div>
            <Header />
            <FeatureMovies />
            <MediaList title="Xếp hạng cao" tabs={TOP_RATED_TABS} />
            <MediaList title="Thịnh hành" tabs={TRENDING_TABS} />
            <Footer />
        </div>
    );
}

export default HomePage;
