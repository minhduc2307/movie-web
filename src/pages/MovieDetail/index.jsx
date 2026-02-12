import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faFilm, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/Spinner";
import CircularProgressBar from "@components/CircularProgressBar";
import Img from "@components/Img";
import Toast, { showSuccessToast } from "@components/Toast";
import { useUserContext } from "@context/UserProvider";
import { useModalContext } from "@context/ModalProvider";
import "./movie-detail.css";

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
        <div className="movie-detail-container">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="movie-detail-inner">
                    <div className="movie-detail-hero">
                        <figure className="movie-detail-backdrop">
                            <Img
                                src={movieInfo?.thumb_url}
                                width={1280}
                                height={450}
                                className="movie-detail-backdrop-img"
                            />
                        </figure>
                        <figure className="movie-detail-poster">
                            <Img
                                src={movieInfo?.poster_url}
                                width={200}
                                height={285}
                                className="movie-detail-poster-img"
                            />
                        </figure>
                        <div className="movie-detail-info-wrapper">
                            <div className="movie-detail-rating-genres">
                                {movieInfo?.tmdb?.vote_average ? (
                                    <div className="movie-detail-rating">
                                        <CircularProgressBar
                                            percent={Math.round(
                                                movieInfo?.tmdb?.vote_average *
                                                    10,
                                            )}
                                        />
                                        <span className="movie-detail-rating-text">
                                            Rating
                                        </span>
                                    </div>
                                ) : null}
                                <ul className="movie-detail-genres">
                                    {(movieInfo.category || [])
                                        .slice(0, 3)
                                        .map((genre) => (
                                            <li
                                                key={genre.id}
                                                className="movie-detail-genre-item"
                                            >
                                                {genre.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="movie-detail-actions">
                                <Link
                                    to={`/watch/${movieInfo.slug}`}
                                    className="movie-detail-watch-button"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlay}
                                        className="text-white"
                                    />
                                    Xem ngay
                                </Link>
                                {movieInfo?.trailer_url && (
                                    <button
                                        className="movie-detail-trailer-button"
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
                                        className="movie-detail-favorite-button"
                                        onClick={() =>
                                            addFavoriteList(movieInfo)
                                        }
                                    >
                                        <img
                                            src="/heart.svg"
                                            alt=""
                                            className="movie-detail-favorite-icon"
                                        />
                                        Thêm vào yêu thích
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="movie-detail-description">
                        <h1 className="movie-detail-title">
                            {movieInfo?.name}
                        </h1>
                        <p>
                            <span className="movie-detail-info-label">
                                Thời gian:
                            </span>{" "}
                            {movieInfo?.time}
                        </p>
                        <p>
                            <span className="movie-detail-info-label">
                                Năm phát hành:
                            </span>{" "}
                            {movieInfo?.year}
                        </p>
                        <p>
                            <span className="movie-detail-info-label">
                                Thể loại:
                            </span>{" "}
                            {(movieInfo?.category || [])
                                .map((genre) => genre.name)
                                .join(", ")}
                        </p>
                        <p>
                            <span className="movie-detail-info-label">
                                Nội dung:
                            </span>{" "}
                            {movieInfo?.content}
                        </p>
                        <p>
                            <span className="movie-detail-info-label">
                                Đạo diễn:
                            </span>{" "}
                            {(movieInfo?.director || []).join(", ")}
                        </p>
                        <p>
                            <span className="movie-detail-info-label">
                                Diễn viên:
                            </span>{" "}
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
