import { useEffect, useState } from "react";
import Movie from "./Movie";
import Spinner from "@components/Spinner";

const FeatureMovies = () => {
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
        <div className="h-full bg-[#292e39]">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="relative hidden h-full text-white md:block">
                    <Movie movies={movies} />
                </div>
            )}
        </div>
    );
};
export default FeatureMovies;
