import Hls from "hls.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./watch.css";

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
        <div className="watch-container">
            <div className="watch-inner">
                <h1 className="watch-title">
                    {movieInfo?.type === "single"
                        ? movieInfo.name
                        : `${movieInfo.name} ~ Tập ${currentChap + 1}`}
                </h1>
                <div className="watch-content">
                    <div className="watch-video-wrapper">
                        <div className="watch-video-container">
                            <video
                                className="watch-video"
                                id="film-video"
                                controls
                            ></video>
                        </div>
                    </div>
                    {movieInfo?.type !== "single" && (
                        <div className="watch-chapters-wrapper">
                            <div className="watch-chapters-container">
                                <p className="watch-chapters-title">
                                    Chọn tập phim
                                </p>
                                <ul className="watch-chapters-list">
                                    {chapterList.map((chap, index) => (
                                        <li
                                            key={chap.link_m3u8}
                                            className={
                                                currentChap === index
                                                    ? "watch-chapter-item-active"
                                                    : "watch-chapter-item"
                                            }
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
                <div className="watch-info">
                    <div className="watch-info-row">
                        <p className="watch-info-label">Thời gian:</p>
                        <p>{movieInfo.time}</p>
                    </div>
                    <div className="watch-info-row">
                        <p className="watch-info-label-nowrap">Nội dung:</p>
                        <p>{movieInfo.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
