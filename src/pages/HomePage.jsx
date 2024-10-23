import FeatureMovies from "@components/FeatureMovies";
import MediaList from "@components/MediaList";
import { TABS } from "@libs/constants";

function HomePage() {
    const screenWidth = document.documentElement.clientWidth;
    let sliderItem;
    if (screenWidth > 1024) {
        sliderItem = screenWidth / 3;
    } else if (screenWidth >= 768) {
        sliderItem = screenWidth / 2;
    } else {
        sliderItem = 0;
    }

    const ratio = 0.5635;
    const sliderHeight = sliderItem * ratio;

    return (
        <div>
            {sliderHeight ? (
                <div style={{ height: `${sliderHeight}px` }}>
                    <FeatureMovies />
                </div>
            ) : null}
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
