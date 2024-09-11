import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgressBar from "../CircularProgressBar";
import { formatCurrency } from "../../libs/utils";

export const Banner = ({ mediaInfo }) => {
    const certification = (
        (mediaInfo.release_dates?.results || []).find(
            (result) => result.iso_3166_1 === "US",
        )?.release_dates || []
    ).find((releaseDate) => releaseDate.certification)?.certification;

    const crews = (mediaInfo.credits?.crew || [])
        .filter((crew) => ["Director", "Writer"].includes(crew.job))
        .map((person) => ({
            id: person.id,
            name: person.name,
            job: person.job,
        }));

    const groupedCrews = crews.reduce((acc, curr) => {
        if (!acc[curr.job]) {
            acc[curr.job] = [];
        }
        acc[curr.job].push(curr);
        return acc;
    }, {});

    return (
        <div className="relative overflow-hidden text-lg lg:text-xl">
            <img
                src={`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`}
                alt=""
                className="absolute inset-0 hidden w-full object-cover brightness-[0.1] xl:block"
            />
            <div className="absolute inset-0 bg-black xl:hidden"></div>
            <div className="relative mx-auto flex max-w-screen-xl flex-col gap-6 px-6 py-10 lg:flex-row lg:gap-8">
                <figure className="flex flex-1 justify-center">
                    <img
                        src={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${mediaInfo.poster_path}`}
                        alt=""
                        className="rounded-xl object-cover"
                    />
                </figure>
                <div className="flex-[2] text-white">
                    <div className="flex flex-col items-start justify-between lg:flex-row lg:items-center">
                        <h1 className="text-3xl font-bold">
                            {mediaInfo.title}
                        </h1>
                        <button className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#ff0000] px-4 py-3 text-base lg:mt-0">
                            <img src="/add.svg" alt="" />
                            Thêm vào yêu thích
                        </button>
                    </div>
                    <div className="mt-10 flex flex-col items-start lg:flex-row lg:items-center">
                        <span className="border border-slate-400 p-1 text-gray-400">
                            {certification}
                        </span>
                        <ul className="mt-4 flex flex-wrap gap-2 lg:ml-3 lg:mt-0">
                            {(mediaInfo.genres || []).map((genre) => (
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
                                percent={Math.round(
                                    mediaInfo?.vote_average * 10,
                                )}
                            />
                            <span>Rating</span>
                        </div>
                        <button>
                            <FontAwesomeIcon icon={faPlay} className="mr-2" />
                            Xem ngay
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <p className="order-2 mt-4 text-lg lg:order-1 lg:text-xl">
                            {mediaInfo.overview}
                        </p>
                        <div className="order-1 mt-6 space-y-2 lg:order-2">
                            <div className="flex gap-2">
                                <p className="flex-shrink-0 font-medium">
                                    Thể loại:
                                </p>
                                <p>
                                    {(mediaInfo.genres || [])
                                        .map((genre) => genre.name)
                                        .join(", ")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <p className="flex-shrink-0 font-medium">
                                    Ngày phát hành:
                                </p>
                                <p>{mediaInfo.release_date}</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="flex-shrink-0 font-medium">
                                    Ngân sách:
                                </p>
                                <p>{formatCurrency(mediaInfo.budget)}</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="flex-shrink-0 font-medium">
                                    Doanh thu:
                                </p>
                                <p>{formatCurrency(mediaInfo.revenue)}</p>
                            </div>
                            {groupedCrews["Director"] && (
                                <div className="flex gap-2">
                                    <p className="flex-shrink-0 font-medium">
                                        Đạo diễn:
                                    </p>
                                    <p>
                                        {(groupedCrews["Director"] || []).map(
                                            (crew) => crew.name,
                                        )}
                                    </p>
                                </div>
                            )}
                            {groupedCrews["Writer"] && (
                                <div className="flex gap-2">
                                    <p className="flex-shrink-0 font-medium">
                                        Kịch bản:
                                    </p>
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
        </div>
    );
};
