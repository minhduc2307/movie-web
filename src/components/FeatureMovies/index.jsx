import { useEffect, useState } from "react";
import Movie from "./Movie";

const FeatureMovies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_HOST2}/v1/api/danh-sach/phim-bo`,
        ).then(async (res) => {
            const responseData = await res.json();
            const data = responseData?.data;
            const popularMovies = data.items.slice(1, 6);
            setMovies(popularMovies);
        });
    }, []);

    return (
        <div className="relative hidden text-white md:block">
            <Movie movies={movies} />
        </div>
    );
};
export default FeatureMovies;
