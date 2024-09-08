import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgressBar from "../components/CircularProgressBar";

const MovieDetail = () => {
    return (
        <div>
            <div className="relative overflow-hidden text-lg lg:text-xl">
                <img
                    src="https://image.tmdb.org/t/p/original/tbgIhYwQ5IAgNaFU1SBBxxNXCmm.jpg"
                    alt=""
                    className="absolute inset-0 brightness-[0.2]"
                />
                <div className="relative mx-auto flex max-w-screen-xl gap-6 px-6 py-10 lg:gap-8">
                    <figure className="flex-1">
                        <img
                            src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/xEt2GSz9z5rSVpIHMiGdtf0czyf.jpg"
                            alt=""
                            className="rounded-xl object-cover"
                        />
                    </figure>
                    <div className="h-96 flex-[2] text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold">Silo</h1>
                            <button className="flex items-center justify-center gap-2 rounded-full bg-[#ff0000] px-8 py-4 text-base">
                                <img src="/add.svg" alt="" />
                                Add to Favorite
                            </button>
                        </div>
                        <div className="mt-10 flex items-center">
                            <span className="border border-slate-400 p-1 text-gray-400">
                                G
                            </span>
                            <ul className="ml-3 flex flex-wrap gap-2">
                                <li className="rounded-lg bg-white p-2 font-medium text-black">
                                    Drama
                                </li>
                                <li className="rounded-lg bg-white p-2 font-medium text-black">
                                    Science Fiction
                                </li>
                            </ul>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <CircularProgressBar />
                                <span>Rating</span>
                            </div>
                            <button>
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="mr-2"
                                />
                                See now
                            </button>
                        </div>
                        <p className="mt-4 text-lg lg:text-xl">
                            In a ruined and toxic future, a community exists in
                            a giant underground silo that plunges hundreds of
                            stories deep. There, men and women live in a society
                            full of regulations they believe are meant to
                            protect them.
                        </p>
                        <div className="mt-6 space-y-2">
                            <div className="flex gap-2">
                                <p className="font-medium">Genre:</p>
                                <p>Drama, Science Fiction</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="font-medium">Date Release:</p>
                                <p>2024/06/05</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="font-medium">Director:</p>
                                <p>Tim Robbins, Avi Nash</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="font-medium">Writer:</p>
                                <p>Rashida Jones, Tim Robbins</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MovieDetail;
