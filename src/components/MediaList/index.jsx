import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const MediaList = () => {
    const [mediaList, setMediaList] = useState([]);

    useEffect(() => {
        fetch("https://api.themoviedb.org/3/trending/all/day?language=en-US", {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        })
            .then(async (res) => {
                const data = await res.json();
                const trendingMediaList = data.results.slice(0, 18);
                setMediaList(trendingMediaList);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="px-8 bg-[#292e39] text-white text-[1.2vw] py-10">
            <div className="flex items-center gap-5 mb-6">
                <h2 className="text-[2vw] font-bold">Phim Hot</h2>
                <ul className="flex border border-white rounded-md">
                    <li className="text-black bg-white cursor-pointer px-6 py-1 rounded-md">Tất cả</li>
                    <li className="text-[#9e9da8] cursor-pointer px-6 py-1 rounded-md">Phim</li>
                    <li className="text-[#9e9da8] cursor-pointer px-6 py-1 rounded-md">TV Show</li>
                </ul>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-7">
                {mediaList.map((media) => (
                    <MovieCard
                        key={media.id}
                        mediaType={media.media_type}
                        backdropPath={media.backdrop_path}
                        title={media.title || media.name}
                        releaseDate={media.release_date || media.first_air_date}
                        point={media.vote_average}
                    />
                ))}
            </div>
        </div>
    );
};
export default MediaList;
