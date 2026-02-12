import MediaList from "@components/MediaList";
import { MEDIA_TABS } from "@libs/constants";
import "./single-movie.css";

const SingleMovie = () => {
    return (
        <div className="single-movie-container">
            <MediaList tab={MEDIA_TABS[0]} />
        </div>
    );
};

export default SingleMovie;
