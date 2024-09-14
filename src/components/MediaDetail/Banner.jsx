import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgressBar from "../CircularProgressBar";
import { formatCurrency } from "../../libs/utils";

export const Banner = ({
    backdropPath,
    posterPath,
    title,
    genres,
    certification,
    crews,
    point,
    overview,
    releaseDate,
    budget,
    revenue,
}) => {
    const groupedCrews = (crews || []).reduce((acc, curr) => {
        if (!acc[curr.job]) {
            acc[curr.job] = [];
        }
        acc[curr.job].push(curr);
        return acc;
    }, {});

    return (
        <div className="relative overflow-hidden text-lg lg:text-xl">
            <img
                src={`https://image.tmdb.org/t/p/original${backdropPath}`}
                alt=""
                className="absolute inset-0 w-full object-cover brightness-[0.1]"
            />
            <div className="relative mx-auto flex max-w-screen-xl gap-6 px-6 py-10 lg:gap-8">
                <figure className="flex-1">
                    <img
                        src={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${posterPath}`}
                        alt=""
                        className="rounded-xl object-cover"
                    />
                </figure>
                <div className="h-96 flex-[2] text-white">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <button className="flex items-center justify-center gap-2 rounded-full bg-[#ff0000] px-4 py-3 text-base">
                            <img src="/add.svg" alt="" />
                            Thêm vào yêu thích
                        </button>
                    </div>
                    <div className="mt-10 flex items-center">
                        <span className="border border-slate-400 p-1 text-gray-400">
                            {certification}
                        </span>
                        <ul className="ml-3 flex flex-wrap gap-2">
                            {(genres || []).map((genre) => (
                                <li
                                    key={genre.id}
                                    className="rounded-lg bg-white p-2 text-base font-medium text-black"
                                >
                                    {genre.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <CircularProgressBar
                                percent={Math.round(point * 10)}
                            />
                            <span>Rating</span>
                        </div>
                        <button>
                            <FontAwesomeIcon icon={faPlay} className="mr-2" />
                            Xem ngay
                        </button>
                    </div>
                    <p className="mt-4 text-lg lg:text-xl">{overview}</p>
                    <div className="mt-6 space-y-2">
                        <div className="flex gap-2">
                            <p className="font-medium">Thể loại:</p>
                            <p>
                                {(genres || [])
                                    .map((genre) => genre.name)
                                    .join(", ")}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-medium">Ngày phát hành:</p>
                            <p>{releaseDate}</p>
                        </div>
                        {budget && (
                            <div className="flex gap-2">
                                <p className="font-medium">Ngân sách:</p>
                                <p>{formatCurrency(budget)}</p>
                            </div>
                        )}
                        {revenue && (
                            <div className="flex gap-2">
                                <p className="font-medium">Doanh thu:</p>
                                <p>{formatCurrency(revenue)}</p>
                            </div>
                        )}
                        {groupedCrews["Director"] && (
                            <div className="flex gap-2">
                                <p className="font-medium">Đạo diễn:</p>
                                <p>
                                    {(groupedCrews["Director"] || []).map(
                                        (crew) => crew.name,
                                    )}
                                </p>
                            </div>
                        )}
                        {groupedCrews["Writer"] && (
                            <div className="flex gap-2">
                                <p className="font-medium">Kịch bản:</p>
                                <p>
                                    {" "}
                                    {(groupedCrews["Writer"] || [])
                                        .map((crew) => crew.name)
                                        .join(", ")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
