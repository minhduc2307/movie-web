import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/Spinner";
import CircularProgressBar from "@components/CircularProgressBar";
import Img from "@components/Img";

const MovieDetail = () => {
    const { slug } = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_HOST}/phim/${slug}`)
            .then(async (res) => {
                const data = await res.json();
                document.title = data.movie.name;
                setMovieInfo(data.movie);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug]);

    return (
        <div className="min-h-[40vh] bg-[#06121d] px-5 py-3 lg:py-5">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="mx-auto max-w-screen-xl">
                    <div className="relative py-3">
                        <figure className="h-[450px]">
                            <Img
                                src={movieInfo?.thumb_url}
                                width={1280}
                                height={450}
                                className="h-full w-full object-cover brightness-50"
                            />
                        </figure>
                        <figure className="absolute left-5 top-5 h-[285px] w-[200px]">
                            <Img
                                src={movieInfo?.poster_url}
                                width={200}
                                height={285}
                                className="h-full w-full object-cover"
                            />
                        </figure>
                        <div className="absolute bottom-5 left-5 sm:bottom-6 md:bottom-7 lg:bottom-9">
                            <div className="flex items-center gap-[10px]">
                                {movieInfo?.tmdb?.vote_average ? (
                                    <div className="flex items-center gap-1">
                                        <CircularProgressBar
                                            percent={Math.round(
                                                movieInfo?.tmdb?.vote_average *
                                                    10,
                                            )}
                                        />
                                        <span className="text-white">
                                            Rating
                                        </span>
                                    </div>
                                ) : null}
                                <ul className="flex flex-wrap gap-2">
                                    {(movieInfo.category || [])
                                        .slice(0, 3)
                                        .map((genre) => (
                                            <li
                                                key={genre.id}
                                                className="rounded-lg bg-white p-[6px] text-sm font-medium text-black"
                                            >
                                                {genre.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="left-5 mt-2 flex flex-wrap items-center gap-2 sm:mt-3">
                                <a
                                    href={`/watch/${movieInfo.slug}`}
                                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#ffb700] px-5 font-medium text-[#171c28]"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlay}
                                        className="text-white"
                                    />
                                    Xem ngay
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-2 text-base text-white lg:text-lg">
                        <h1 className="text-3xl font-bold lg:text-4xl">
                            {movieInfo?.name}
                        </h1>
                        <p>
                            <span className="font-medium">Thời gian:</span>{" "}
                            {movieInfo?.time}
                        </p>
                        <p>
                            <span className="font-medium">Năm phát hành:</span>{" "}
                            {movieInfo?.year}
                        </p>
                        <p>
                            <span className="font-medium">Thể loại:</span>{" "}
                            {(movieInfo?.category || [])
                                .map((genre) => genre.name)
                                .join(", ")}
                        </p>
                        <p>
                            <span className="font-medium">Nội dung:</span>{" "}
                            {movieInfo?.content}
                        </p>
                        <p>
                            <span className="font-medium">Đạo diễn:</span>{" "}
                            {(movieInfo?.director || []).join(", ")}
                        </p>
                        <p>
                            <span className="font-medium">Diễn viên:</span>{" "}
                            {(movieInfo?.actor || []).join(", ")}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MovieDetail;
