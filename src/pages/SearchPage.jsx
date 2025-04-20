import MovieCard from "@components/MediaList/MovieCard";
import Spinner from "@components/Spinner";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDebounce from "@hooks/useDebounce";
import { useEffect, useState } from "react";

const SearchPage = () => {
    const [searchText, setSearchText] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const keyword = useDebounce(searchText);

    useEffect(() => {
        if (!keyword) return;
        const fetchSearch = async () => {
            setIsLoading(true);
            const res = await fetch(
                `${import.meta.env.VITE_API_HOST}/v1/api/tim-kiem?keyword=${keyword.trim()}&limit=18`,
            );
            const responseData = await res.json();
            const data = responseData?.data;
            setMovieList(data?.items);
            setIsLoading(false);
        };
        fetchSearch();
    }, [keyword]);

    return (
        <div className="min-h-[40vh] bg-[#292e39] px-5 py-3 text-white lg:py-5">
            <div className="mx-auto max-w-screen-xl">
                <form className="flex items-center gap-2">
                    <div className="flex h-12 w-full items-center rounded-lg border-[2px] border-solid border-[#d2d1d6] px-3 focus-within:border-[#77dae6] sm:w-1/2 xl:w-1/3">
                        <img
                            src="/search.svg"
                            alt="Search"
                            className="mr-2 h-4 w-4 invert"
                        />
                        <input
                            type="text"
                            placeholder="Nhập tên phim bạn cần tìm"
                            className="h-full w-full"
                            autoFocus
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        {searchText && (
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
                        )}
                    </div>
                </form>

                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                        {(movieList || []).map((media) => (
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
                )}
            </div>
        </div>
    );
};
export default SearchPage;
