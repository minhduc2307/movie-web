import MovieCard from "@components/MediaList/MovieCard";
import Spinner from "@components/Spinner";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDebounce from "@hooks/useDebounce";
import { useEffect, useState } from "react";
import "./search-page.css";

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
        <div className="search-page-container">
            <div className="search-page-inner">
                <form className="search-page-form">
                    <div className="search-page-input-wrapper">
                        <img
                            src="/search.svg"
                            alt="Search"
                            className="search-page-icon"
                        />
                        <input
                            type="text"
                            placeholder="Nhập tên phim bạn cần tìm"
                            className="search-page-input"
                            autoFocus
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        {searchText && (
                            <button
                                type="reset"
                                className="search-page-clear-button"
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
                    <div className="search-page-results">
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
