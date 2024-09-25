import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";

const TV = () => {
    return <MediaList tab={MEDIA_TABS[1]} />;
};
export default TV;
