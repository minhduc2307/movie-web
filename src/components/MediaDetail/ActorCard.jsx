const ActorCard = ({ name, character, profilePath }) => {
    return (
        <article className="rounded-2xl bg-[#171c28] p-2 text-white shadow-sm">
            <div className="relative pt-[100%]">
                <img
                    src={
                        profilePath
                            ? `https://image.tmdb.org/t/p/w276_and_h350_face${profilePath}`
                            : "/NoImage.svg"
                    }
                    alt=""
                    className="absolute left-0 top-0 h-full w-full object-contain"
                />
            </div>
            <div className="mt-1">
                <h3 className="font-semibold lg:text-xl">{name}</h3>
                <p className="mt-1 text-[#7C7A7A]">{character}</p>
            </div>
        </article>
    );
};
export default ActorCard;
