import { useEffect, useState } from "react";
import Movie from "./Movie";

const FeatureMovies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular", {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        }).then(async (res) => {
            const data = await res.json();
            const popularMovies = data.results.slice(0, 4);
            setMovies(popularMovies);
        });
    }, []);

    return (
        <div className="relative text-white hidden">
            <Movie movies={movies} />
        </div>
    );
};
export default FeatureMovies;
