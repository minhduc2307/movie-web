import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";

const SingleMovie = () => {
    return (
        <div className="min-h-screen bg-[#292e39]">
            <MediaList tab={MEDIA_TABS[0]} />
        </div>
    );
};

export default SingleMovie;
