import { Link } from "react-router-dom";

const MovieCard = ({
    id,
    mediaType,
    backdropPath,
    title,
    releaseDate,
    point,
}) => {
    const starRating = Math.round(point) / 2;
    return (
        <Link to={mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`}>
            <article className="flex h-full flex-col rounded-2xl bg-[#171c28] p-3 shadow-xl shadow-slate-700">
                <div className="relative overflow-hidden pt-[100%]">
                    {mediaType === "tv" && (
                        <p className="absolute left-0 top-0 rounded-lg bg-[#a3765d] p-1 font-medium text-white shadow-lg">
                            TV Show
                        </p>
                    )}
                    <img
                        src={`https://image.tmdb.org/t/p/w500${backdropPath}`}
                        alt=""
                        className="absolute left-0 top-0 h-full w-full object-contain lg:duration-200 lg:ease-in lg:hover:scale-110"
                    />
                </div>
                <h3 className="mb-4 font-semibold lg:text-xl">{title}</h3>
                <div className="mt-auto flex items-center">
                    <p className="lg:text-lg">{releaseDate}</p>
                    <span className="ml-auto mr-1 lg:text-lg">
                        {starRating}
                    </span>
                    <img src="star.svg" alt="" />
                </div>
            </article>
        </Link>
    );
};
export default MovieCard;
