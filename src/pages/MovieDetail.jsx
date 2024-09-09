import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgressBar from "../components/CircularProgressBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const MovieDetail = () => {
    const { id: movieId } = useParams();
    const [movieInfo, setMovieInfo] = useState({});

    const certification = (
        (movieInfo.release_dates?.results || []).find(
            (result) => result.iso_3166_1 === "US",
        )?.release_dates || []
    ).find((releaseDate) => releaseDate.certification)?.certification;

    const crews = (movieInfo.credits?.crew || [])
        .filter((crew) => ["Director", "Writer"].includes(crew.job))
        .map((person) => ({
            id: person.id,
            name: person.name,
            job: person.job,
        }));

    const groupedCrews = crews.reduce((acc, curr) => {
        if (!acc[curr.job]) {
            acc[curr.job] = [];
        }
        acc[curr.job].push(curr);
        return acc;
    }, {});

    useEffect(() => {
        fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=vi&append_to_response=release_dates,credits`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            },
        ).then(async (res) => {
            const data = await res.json();
            setMovieInfo(data);
        });
    }, [movieId]);

    return (
        <div>
            <div className="relative overflow-hidden text-lg lg:text-xl">
                <img
                    src={`https://image.tmdb.org/t/p/original${movieInfo.backdrop_path}`}
                    alt=""
                    className="absolute inset-0 brightness-[0.1]"
                />
                <div className="relative mx-auto flex max-w-screen-xl gap-6 px-6 py-10 lg:gap-8">
                    <figure className="flex-1">
                        <img
                            src={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${movieInfo.poster_path}`}
                            alt=""
                            className="rounded-xl object-cover"
                        />
                    </figure>
                    <div className="h-96 flex-[2] text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold">
                                {movieInfo.title}
                            </h1>
                            <button className="flex items-center justify-center gap-2 rounded-full bg-[#ff0000] px-4 py-3 text-base">
                                <img src="/add.svg" alt="" />
                                Thêm vào yêu thích
                            </button>
                        </div>
                        <div className="mt-10 flex items-center">
                            <span className="border border-slate-400 p-1 text-gray-400">
                                {certification}
                            </span>
                            <ul className="ml-3 flex flex-wrap gap-2">
                                {(movieInfo.genres || []).map((genre) => (
                                    <li
                                        key={genre.id}
                                        className="rounded-lg bg-white p-2 text-base font-medium text-black"
                                    >
                                        {genre.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <CircularProgressBar
                                    percent={Math.round(
                                        movieInfo?.vote_average * 10,
                                    )}
                                />
                                <span>Rating</span>
                            </div>
                            <button>
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="mr-2"
                                />
                                Xem ngay
                            </button>
                        </div>
                        <p className="mt-4 text-lg lg:text-xl">
                            {movieInfo.overview}
                        </p>
                        <div className="mt-6 space-y-2">
                            <div className="flex gap-2">
                                <p className="font-medium">Thể loại:</p>
                                <p>
                                    {(movieInfo.genres || [])
                                        .map((genre) => genre.name)
                                        .join(", ")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <p className="font-medium">Ngày phát hành:</p>
                                <p>{movieInfo.release_date}</p>
                            </div>
                            {groupedCrews["Director"] && (
                                <div className="flex gap-2">
                                    <p className="font-medium">Đạo diễn:</p>
                                    <p>
                                        {(groupedCrews["Director"] || []).map(
                                            (crew) => crew.name,
                                        )}
                                    </p>
                                </div>
                            )}
                            {groupedCrews["Writer"] && (
                                <div className="flex gap-2">
                                    <p className="font-medium">Kịch bản:</p>
                                    <p>
                                        {" "}
                                        {(groupedCrews["Writer"] || [])
                                            .map((crew) => crew.name)
                                            .join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MovieDetail;
