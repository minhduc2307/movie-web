import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import { Banner } from "@components/MediaDetail/Banner";

const MovieDetail = () => {
    const { slug } = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_HOST2}/phim/${slug}`)
            .then(async (res) => {
                const data = await res.json();
                setMovieInfo(data.movie);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug]);

    console.log(movieInfo);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Banner
                name={movieInfo.name}
                thumbUrl={movieInfo.thumb_url}
                posterUrl={movieInfo.poster_url}
                time={movieInfo.time}
                point={movieInfo?.tmdb?.vote_average}
                genres={movieInfo.category}
                actors={movieInfo.actor}
                directors={movieInfo.director}
                content={movieInfo.content}
                year={movieInfo.year}
            />
        </div>
    );
};
export default MovieDetail;
