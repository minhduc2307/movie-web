import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";
import "./cartoon-movie.css";

const CartoonMovie = () => {
    return (
        <div className="cartoon-movie-container">
            <MediaList tab={MEDIA_TABS[2]} />
        </div>
    );
};
export default CartoonMovie;
