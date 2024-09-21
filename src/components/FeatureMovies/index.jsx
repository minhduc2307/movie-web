import { useEffect, useState } from "react";
import Movie from "./Movie";
import Spinner from "@components/Spinner";

const FeatureMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_HOST2}/v1/api/danh-sach/phim-le`)
            .then(async (res) => {
                const responseData = await res.json();
                const data = responseData?.data;
                const popularMovies = data.items.slice(1, 6);
                setMovies(popularMovies);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <Spinner />;

    return (
        <div className="relative hidden text-white md:block">
            <Movie movies={movies} />
        </div>
    );
};
export default FeatureMovies;
