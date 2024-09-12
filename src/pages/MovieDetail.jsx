import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Banner } from "../components/MediaDetail/Banner";
import ActorList from "../components/MediaDetail/ActorList";
import Spinner from "../components/Spinner";

const MovieDetail = () => {
    const { id: movieId } = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=vi&append_to_response=release_dates,credits`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            },
        )
            .then(async (res) => {
                const data = await res.json();
                setMovieInfo(data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [movieId]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Banner mediaInfo={movieInfo} />
            <div className="bg-[#292d38] text-white">
                <div className="mx-auto max-w-screen-xl px-6 py-10">
                    <ActorList actors={movieInfo.credits?.cast || []} />
                </div>
            </div>
        </div>
    );
};
export default MovieDetail;
