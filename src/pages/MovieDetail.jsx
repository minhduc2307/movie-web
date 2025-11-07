import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faFilm, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/Spinner";
import CircularProgressBar from "@components/CircularProgressBar";
import Img from "@components/Img";
import Toast, { showSuccessToast } from "@components/Toast/Toast";
import { useUserContext } from "@context/UserProvider";
import { useModalContext } from "@context/ModalProvider";

const MovieDetail = () => {
    const { slug } = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { favoriteList, setFavoriteList, userInfo } = useUserContext();
    const { openPopup } = useModalContext();

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

    const addFavoriteList = (movieInfo) => {
        const searchedMovie = (favoriteList || []).find((movie) => {
            return movie._id === movieInfo._id;
        });
        if (searchedMovie) return;
        showSuccessToast("Thành công", "Đã thêm phim vào danh sách yêu thích");
        setFavoriteList([movieInfo, ...favoriteList]);
    };

    const trailerKey = (movieInfo?.trailer_url || "").split("?v=")[1];

    return (
        <div className="min-h-[866px] bg-[#06121d] px-5 py-3 lg:py-5">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="mx-auto max-w-screen-xl">
                    <div className="relative py-3">
                        <figure className="h-[490px] lg:h-[450px]">
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
                                <Link
                                    to={`/watch/${movieInfo.slug}`}
                                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#ffb700] px-5 font-medium text-[#171c28]"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlay}
                                        className="text-white"
                                    />
                                    Xem ngay
                                </Link>
                                {movieInfo?.trailer_url && (
                                    <button
                                        className="flex h-10 items-center justify-center gap-2 rounded-full bg-black px-3 font-medium text-white"
                                        onClick={() => {
                                            openPopup(
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                                    className="aspect-video w-[80vw] sm:w-[70vw]"
                                                    title="YouTube video player"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    allowFullScreen
                                                ></iframe>,
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faFilm} />
                                        Trailer
                                    </button>
                                )}
                                {userInfo && (
                                    <button
                                        className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#ff0000] px-5 text-base text-white"
                                        onClick={() =>
                                            addFavoriteList(movieInfo)
                                        }
                                    >
                                        <img
                                            src="/heart.svg"
                                            alt=""
                                            className="invert"
                                        />
                                        Thêm vào yêu thích
                                    </button>
                                )}
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
            <Toast />
        </div>
    );
};
export default MovieDetail;
