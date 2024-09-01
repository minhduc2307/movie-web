import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const MediaList = ({ title, tabs }) => {
    const [mediaList, setMediaList] = useState([]);
    const [currentTabId, setCurrentTabId] = useState(tabs[0]?.id);

    useEffect(() => {
        const url = tabs.find((tab) => tab.id === currentTabId)?.url;
        if (url) {
            fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
                .then(async (res) => {
                    const data = await res.json();
                    const trendingMediaList = data.results.slice(0, 12);
                    setMediaList(trendingMediaList);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [currentTabId, tabs]);

    return (
        <div className="bg-[#292e39] px-5 py-10 text-white lg:px-8">
            <div className="mb-6 flex items-center gap-5">
                <h2 className="text-xl font-bold lg:text-3xl">{title}</h2>
                <ul className="flex rounded-md border border-white">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className={`cursor-pointer rounded-md px-3 py-1 md:px-6 lg:px-6 lg:py-2 ${
                                tab.id === currentTabId
                                    ? "bg-white text-black"
                                    : "text-[#9e9da8]"
                            }`}
                            onClick={() => {
                                setCurrentTabId(tab.id);
                            }}
                        >
                            {tab.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {mediaList.map((media) => (
                    <MovieCard
                        key={media.id}
                        mediaType={media.media_type || currentTabId}
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
