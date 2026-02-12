import MovieCard from "@components/MediaList/MovieCard";
import { useUserContext } from "@context/UserProvider";
import "./favorite-list.css";

const FavoriteList = () => {
    const { favoriteList: movieList, setFavoriteList } = useUserContext();
    const deleteFavoriteMovie = (id) => {
        const updatedMediaList = movieList.filter((movie) => {
            return movie._id !== id;
        });
        setFavoriteList(updatedMediaList);
    };
    return (
        <div className="favorite-list-container">
            <div className="favorite-list-inner">
                <h1 className="favorite-list-title">Danh sách yêu thích</h1>
                <div className="favorite-list-grid">
                    {movieList.map((movie) => (
                        <div key={movie._id} className="favorite-list-item">
                            <MovieCard
                                name={movie.name}
                                posterUrl={
                                    (movie.poster_url || "").split(".com/")[1]
                                }
                                year={movie.year}
                                time={movie.time}
                                type={movie.type}
                                slug={movie.slug}
                            />
                            <button
                                className="favorite-list-delete-button"
                                onClick={() => {
                                    deleteFavoriteMovie(movie?._id);
                                }}
                            >
                                <div className="favorite-list-delete-icon"></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default FavoriteList;
