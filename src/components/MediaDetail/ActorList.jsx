import { useState } from "react";
import ActorCard from "./ActorCard";

const ActorList = ({ actors }) => {
    const [isShowMore, setIsShowMore] = useState(false);

    const currentActors = isShowMore ? actors.slice(0, 30) : actors.slice(0, 6);

    return (
        <div>
            <h2 className="mb-4 text-xl font-bold">Danh sách diễn viên</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {currentActors.map((actor) => (
                    <ActorCard
                        key={actor.id}
                        name={actor.name}
                        character={actor.character}
                        profilePath={actor.profile_path}
                        episodeCount={actor.episodeCount}
                    />
                ))}
            </div>
            <p
                className="mt-3 cursor-pointer"
                onClick={() => setIsShowMore(!isShowMore)}
            >
                {isShowMore ? "Ẩn bớt" : "Xem thêm"}
            </p>
        </div>
    );
};
export default ActorList;
