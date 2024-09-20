import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

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

    console.log(mediaList);

    return (
        <div className="bg-[#292e39] px-5 py-10 text-white lg:px-8">
            <h2 className="mb-2 text-xl font-bold lg:text-3xl">{tab?.title}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
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
