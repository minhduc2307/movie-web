import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Banner } from "../components/MediaDetail/Banner";
import ActorList from "../components/MediaDetail/ActorList";
import Spinner from "../components/Spinner";

const TVShowDetail = () => {
    const { id: tvId } = useParams();
    const [tvInfo, setTvInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(
            `https://api.themoviedb.org/3/tv/${tvId}?language=vi&append_to_response=release_dates,credits`,
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
                setTvInfo(data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [tvId]);

    console.log(tvInfo);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Banner
                backdropPath={tvInfo.backdrop_path}
                posterPath={tvInfo.poster_path}
                title={tvInfo.name}
                genres={tvInfo.genres}
                point={tvInfo.vote_average}
                overview={tvInfo.overview}
                releaseDate={tvInfo.first_air_date}
            />
            <div className="bg-[#292d38] text-white">
                <div className="mx-auto max-w-screen-xl px-6 py-10">
                    <ActorList actors={tvInfo.credits?.cast || []} />
                </div>
            </div>
        </div>
    );
};
export default TVShowDetail;
