import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RelatedMediaList from "@/components/MediaDetail/RelatedMediaList";
import { Banner } from "@/components/MediaDetail/Banner";
import Spinner from "@/components/Spinner";
import ActorList from "@/components/MediaDetail/ActorList";

const MovieDetail = () => {
    const { id: movieId } = useParams();
    const [movieInfo, setMovieInfo] = useState({});
    const [relatedMovies, setRelatedMovies] = useState([]);
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

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        }).then(async (res) => {
            const data = await res.json();
            const currentRelatedMovies = (data.results || []).slice(0, 12);
            setRelatedMovies(currentRelatedMovies);
        });
    }, [movieId]);

    const certification = (
        (movieInfo.release_dates?.results || []).find(
            (result) => result.iso_3166_1 === "US",
        )?.release_dates || []
    ).find((releaseDate) => releaseDate.certification)?.certification;

    const crews = (movieInfo.credits?.crew || [])
        .filter((crew) => ["Director", "Writer"].includes(crew.job))
        .map((person) => ({
            id: person.id,
            name: person.name,
            job: person.job,
        }));

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Banner
                backdropPath={movieInfo.backdrop_path}
                posterPath={movieInfo.poster_path}
                title={movieInfo.title}
                genres={movieInfo.genres}
                certification={certification}
                crews={crews}
                point={movieInfo.vote_average}
                overview={movieInfo.overview}
                releaseDate={movieInfo.release_date}
                budget={movieInfo.budget || 0}
                revenue={movieInfo.revenue || 0}
            />
            <div className="bg-[#292d38] text-white">
                <div className="mx-auto max-w-screen-xl px-6 py-10">
                    <ActorList actors={movieInfo.credits?.cast || []} />
                    <RelatedMediaList mediaList={relatedMovies} />
                </div>
            </div>
        </div>
    );
};
export default MovieDetail;
