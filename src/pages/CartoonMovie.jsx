import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";

const CartoonMovie = () => {
    return (
        <div className="min-h-screen bg-[#292e39]">
            <MediaList tab={MEDIA_TABS[2]} />
        </div>
    );
};
export default CartoonMovie;
