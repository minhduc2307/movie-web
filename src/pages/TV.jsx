import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";

const TV = () => {
    return (
        <div className="min-h-screen bg-[#292e39]">
            <MediaList tab={MEDIA_TABS[1]} />
        </div>
    );
};
export default TV;
