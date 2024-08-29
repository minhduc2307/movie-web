const MovieCard = ({ mediaType, backdropPath, title, releaseDate, point }) => {
    const starRating = Math.round(point) / 2;
    return (
        <article className="p-3 rounded-2xl bg-[#171c28] shadow-xl shadow-slate-700 flex flex-col">
            <div className="relative pt-[100%] overflow-hidden">
                {mediaType === "tv" && (
                    <p className="absolute top-0 left-0 text-white bg-[#a3765d] p-1 font-medium shadow-lg rounded-lg">
                        TV Show
                    </p>
                )}
                <img
                    src={`https://image.tmdb.org/t/p/w500${backdropPath}`}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-contain hover:scale-110 ease-in duration-200"
                />
            </div>
            <h3 className="mt-1 mb-4 font-semibold">{title}</h3>
            <div className="flex items-center mt-auto">
                <p>{releaseDate}</p>
                <span className="ml-auto mr-1">{starRating}</span>
                <img src="star.svg" alt="" />
            </div>
        </article>
    );
};
export default MovieCard;
