import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/Spinner";
import CircularProgressBar from "@components/CircularProgressBar";

const MovieDetail = () => {
    const { slug } = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_HOST}/phim/${slug}`)
            .then(async (res) => {
                const data = await res.json();
                setMovieInfo(data.movie);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-[#06121d] px-5 py-3 lg:py-5">
            <div className="mx-auto max-w-screen-xl">
                <div className="relative py-3">
                    <figure className="h-[450px]">
                        <img
                            src={movieInfo?.thumb_url}
                            alt=""
                            className="h-full w-full object-cover brightness-50"
                        />
                    </figure>
                    <figure className="absolute left-5 top-5 h-[285px] w-[200px]">
                        <img
                            src={movieInfo?.poster_url}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </figure>
                    <div className="absolute bottom-4 left-5 sm:bottom-6 lg:bottom-8">
                        <div className="flex items-center gap-3">
                            {movieInfo?.tmdb?.vote_average ? (
                                <div className="flex items-center gap-1">
                                    <CircularProgressBar
                                        percent={Math.round(
                                            movieInfo?.tmdb?.vote_average * 10,
                                        )}
                                    />
                                    <span className="text-white">Rating</span>
                                </div>
                            ) : null}
                            <ul className="flex flex-wrap gap-2">
                                {(movieInfo.category || [])
                                    .slice(0, 2)
                                    .map((genre) => (
                                        <li
                                            key={genre.id}
                                            className="rounded-lg bg-white p-2 text-sm font-medium text-black"
                                        >
                                            {genre.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="left-5 mt-2 flex flex-wrap items-center gap-2 sm:mt-3">
                            <a
                                href={`/watch/${movieInfo.slug}`}
                                className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#ffb700] px-5 text-[#171c28]"
                            >
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="text-white"
                                />
                                Xem ngay
                            </a>
                            <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#ff0000] px-5 text-base text-white">
                                <img src="/add.svg" alt="" />
                                Thêm vào yêu thích
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-3 space-y-2 text-base text-white lg:text-lg">
                    <h1 className="text-2xl font-bold lg:text-3xl">
                        Phim: {movieInfo?.name}
                    </h1>
                    <div className="flex gap-2">
                        <p className="font-medium">Thời gian:</p>
                        <p>{movieInfo?.time}</p>
                    </div>
                    <p>Nội dung: {movieInfo?.content}</p>
                    <div>
                        <div className="flex gap-2">
                            <p className="font-medium">Thể loại:</p>
                            <p>
                                {(movieInfo?.genres || [])
                                    .map((genre) => genre.name)
                                    .join(", ")}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-medium">Năm phát hành:</p>
                            <p>{movieInfo?.year}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="flex-shrink-0 font-medium">
                                Đạo diễn:
                            </p>
                            <p>
                                {(movieInfo?.director || [])
                                    .map((person) => person)
                                    .join(", ")}
                            </p>
                        </div>
                    </div>
                    <p className="font-medium">Diễn viên:</p>
                    <ul>
                        {(movieInfo?.actor || []).slice(0, 10).map((person) => (
                            <li key={person}>- {person}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default MovieDetail;
