import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./media-list.css";

const MediaList = ({ tab }) => {
    const [mediaList, setMediaList] = useState([]);

    useEffect(() => {
        const url = tab?.url;
        if (url) {
            fetch(`${url}`)
                .then(async (res) => {
                    const responseData = await res.json();
                    const data = responseData?.data.items;
                    setMediaList(data);
                })
                .catch((err) => console.error(err));
        }
    }, [tab]);

    return (
        <div className="media-list-container">
            <h2 className="media-list-title">{tab?.title}</h2>
            <div className="media-list-grid">
                {mediaList.map((media) => (
                    <MovieCard
                        key={media._id}
                        name={media.name}
                        posterUrl={media.poster_url}
                        year={media.year}
                        time={media.time}
                        type={media.type}
                        slug={media.slug}
                    />
                ))}
            </div>
        </div>
    );
};
export default MediaList;
