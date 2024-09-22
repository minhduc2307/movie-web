import MovieCard from "@components/MediaList/MovieCard";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const SearchPage = () => {
    const [searchText, setSearchText] = useState("");
    const [movieList, setMovieList] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const res = await fetch(
            `${import.meta.env.VITE_API_HOST}/v1/api/tim-kiem?keyword=${searchText}&limit=18`,
        );
        const responseData = await res.json();
        const data = responseData?.data;
        setMovieList(data?.items);
    };

    return (
        <div className="min-h-[40vh] bg-[#292e39] px-5 py-3 text-white lg:py-5">
            <div className="mx-auto max-w-screen-xl">
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                >
                    <div className="flex h-12 w-full items-center rounded-lg border-[2px] border-solid border-[#d2d1d6] px-3 sm:w-1/2 xl:w-1/3">
                        <input
                            type="text"
                            placeholder="Nhập tên phim bạn cần tìm"
                            className="h-full w-full"
                            autoFocus
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button
                            type="reset"
                            className="ml-3"
                            onClick={() => {
                                setSearchText("");
                                setMovieList([]);
                            }}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <button
                        className="flex h-[52px] items-center justify-center rounded-lg bg-[#0d6efd] px-5"
                        type="submit"
                    >
                        <img
                            src="/search.svg"
                            alt="Search"
                            className="invert"
                        />
                    </button>
                    <div className="bg-red-50"></div>
                </form>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                    {movieList.map((media) => (
                        <MovieCard
                            key={media._id}
                            name={media.name}
                            posterUrl={media.poster_url}
                            year={media.year}
                            time={media.time}
                            type={media.type}
                            slug={media.slug}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default SearchPage;
