import { useEffect, useState } from "react";
import Movie from "./Movie";
import Spinner from "@components/Spinner";
import "./feature-movies.css";

const FeatureMovies = ({ height }) => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_HOST}/danh-sach/phim-moi-cap-nhat`)
            .then(async (res) => {
                const data = await res.json();
                const popularMovies = data.items;
                setMovies(popularMovies);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="feature-movies-container">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="feature-movies-slider">
                    <Movie movies={movies} height={height} />
                </div>
            )}
        </div>
    );
};
export default FeatureMovies;
