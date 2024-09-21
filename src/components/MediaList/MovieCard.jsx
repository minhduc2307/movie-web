import { Link } from "react-router-dom";

const MovieCard = ({ name, year, posterUrl, type, time, slug }) => {
    return (
        <Link to={`/info/${slug}`}>
            <article className="flex h-full flex-col rounded-2xl bg-[#171c28] p-3 shadow-xl shadow-slate-700">
                <div className="relative overflow-hidden pt-[100%]">
                    {type === "tv" && (
                        <p className="absolute left-0 top-0 rounded-lg bg-[#a3765d] p-1 font-medium text-white shadow-lg">
                            TV Show
                        </p>
                    )}
                    <img
                        src={
                            posterUrl
                                ? `https://phimimg.com/${posterUrl}`
                                : `/NoImage.svg`
                        }
                        alt=""
                        className="absolute left-0 top-0 h-full w-full object-cover lg:duration-200 lg:ease-in lg:hover:scale-110"
                    />
                </div>
                <h3 className="my-1 line-clamp-2 font-semibold lg:text-xl">
                    {name}
                </h3>
                <div className="mt-auto flex justify-between">
                    <p className="lg:text-lg">{year}</p>
                    <p className="lg:text-lg">{time}</p>
                </div>
            </article>
        </Link>
    );
};
export default MovieCard;
