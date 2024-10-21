import Hls from "hls.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Watch = () => {
    const { slug } = useParams();
    const [srcMovie, setSrcMovie] = useState("");
    const [chapterList, setChapterList] = useState([]);
    const [movieInfo, setMovieInfo] = useState({});
    const [currentChap, setCurrentChap] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_HOST}/phim/${slug}`).then(
            async (res) => {
                const data = await res.json();
                document.title = data?.movie.name;
                setChapterList(data?.episodes[0]?.server_data);
                setSrcMovie(
                    data?.episodes[0]?.server_data[currentChap]?.link_m3u8,
                );
                setMovieInfo(data?.movie);
            },
        );
    }, [slug, currentChap]);

    useEffect(() => {
        const video = document.getElementById("film-video");
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(srcMovie);
            hls.attachMedia(video);

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = srcMovie;
            const handlePlay = () => {
                video.play().catch((err) => console.error(err));
            };
            video.addEventListener("canplay", handlePlay);

            return () => {
                video.removeEventListener("canplay", handlePlay);
            };
        }
    }, [srcMovie]);

    return (
        <div className="bg-[#06121d] px-5 py-3 text-white lg:py-5">
            <div className="mx-auto max-w-screen-xl">
                <h1 className="text-2xl font-bold lg:text-3xl">
                    {movieInfo?.type === "single"
                        ? movieInfo.name
                        : `${movieInfo.name} ~ Tập ${currentChap + 1}`}
                </h1>
                <div className="mt-5 flex flex-col gap-2 md:flex-row">
                    <div className="flex-[3]">
                        <div className="relative w-full bg-black pt-[56.25%]">
                            <video
                                className="absolute left-0 top-0 h-full w-full"
                                id="film-video"
                                controls
                            ></video>
                        </div>
                    </div>
                    {movieInfo?.type !== "single" && (
                        <div className="flex-1">
                            <div className="h-[300px] overflow-auto overscroll-none bg-[#1a1c21] p-3 lg:h-[400px]">
                                <p className="text-lg font-medium">
                                    Chọn tập phim
                                </p>
                                <ul className="mt-4 flex flex-wrap items-center gap-3">
                                    {chapterList.map((chap, index) => (
                                        <li
                                            key={chap.link_m3u8}
                                            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg ${currentChap === index ? "bg-green-700" : "bg-[#292e39]"}`}
                                            onClick={() => {
                                                setCurrentChap(index);
                                                setSrcMovie(
                                                    chapterList[index]
                                                        .link_m3u8,
                                                );
                                            }}
                                        >
                                            {index + 1}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-3 lg:text-lg">
                    <div className="flex gap-2">
                        <p className="font-medium">Thời gian:</p>
                        <p>{movieInfo.time}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="whitespace-nowrap font-medium">
                            Nội dung:
                        </p>
                        <p>{movieInfo.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
