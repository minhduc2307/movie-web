import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Banner } from "@/components/MediaDetail/Banner";
import Spinner from "@/components/Spinner";
import ActorList from "@/components/MediaDetail/ActorList";

const TVShowDetail = () => {
    const { id: tvId } = useParams();
    const [tvInfo, setTvInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(
            `https://api.themoviedb.org/3/tv/${tvId}?language=vi&append_to_response=release_dates,aggregate_credits,content_ratings`,
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

    const certification = (tvInfo.content_ratings?.results || []).find(
        (result) => result.iso_3166_1 === "US",
    )?.rating;

    const crews = (tvInfo.aggregate_credits?.crew || [])
        .filter((crew) => {
            return crew.jobs.every(
                (item) => item.job === "Director" || item.job === "Writer",
            );
        })
        .slice(0, 8)
        .map((person) => ({
            id: person.id,
            name: person.name,
            job: person.jobs[0].job,
        }));

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
                certification={certification}
                crews={crews}
                networks={tvInfo.networks || []}
            />
            <div className="bg-[#292d38] text-white">
                <div className="mx-auto max-w-screen-xl px-6 py-10">
                    <ActorList
                        actors={(tvInfo.aggregate_credits?.cast || []).map(
                            (cast) => ({
                                ...cast,
                                character: cast.roles[0].character,
                                episodeCount: cast.roles[0].episode_count,
                            }),
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
export default TVShowDetail;
