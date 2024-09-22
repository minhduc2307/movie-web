import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";

const SingleMovie = () => {
    return <MediaList tab={MEDIA_TABS[0]} />;
};

export default SingleMovie;
