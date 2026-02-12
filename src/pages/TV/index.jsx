import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";
import "./tv.css";

const TV = () => {
    return (
        <div className="tv-container">
            <MediaList tab={MEDIA_TABS[1]} />
        </div>
    );
};
export default TV;
