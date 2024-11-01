import MovieCard from "@components/MediaList/MovieCard";
import { useUserContext } from "@context/UserProvider";

const FavoriteList = () => {
    const { favoriteList: movieList, setFavoriteList } = useUserContext();
    const deleteFavoriteMovie = (id) => {
        const updatedMediaList = movieList.filter((movie) => {
            return movie._id !== id;
        });
        setFavoriteList(updatedMediaList);
    };
    return (
        <div className="bg-[#292e39] px-5 py-6 text-white lg:px-8 lg:py-10">
            <div className="mx-auto max-w-screen-2xl">
                <h1 className="mb-8 rounded-xl bg-red-500 py-4 text-center text-xl font-medium text-white">
                    Danh sách yêu thích
                </h1>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {movieList.map((movie) => (
                        <div key={movie._id} className="relative">
                            <MovieCard
                                name={movie.name}
                                posterUrl={movie.poster_url}
                                year={movie.year}
                                time={movie.time}
                                type={movie.type}
                                slug={movie.slug}
                            />
                            <button
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-[50%] bg-[#fd5465] hover:bg-[#f7941e]"
                                onClick={() => {
                                    deleteFavoriteMovie(movie?._id);
                                }}
                            >
                                <div className="h-1 w-4 rounded-sm bg-white"></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default FavoriteList;
