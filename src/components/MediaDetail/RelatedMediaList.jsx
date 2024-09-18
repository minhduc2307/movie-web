import MovieCard from "../MediaList/MovieCard";

const RelatedMediaList = ({ mediaList }) => {
    return (
        <div>
            <h2 className="mb-4 mt-6 text-xl font-bold">
                Các bộ phim tương tự
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {mediaList.map((media) => (
                    <MovieCard
                        key={media.id}
                        id={media.id}
                        mediaType={media.media_type}
                        backdropPath={media.backdrop_path}
                        title={media.title || media.name}
                        releaseDate={media.release_date || media.first_air_date}
                        point={media.vote_average}
                    />
                ))}
            </div>
        </div>
    );
};
export default RelatedMediaList;
