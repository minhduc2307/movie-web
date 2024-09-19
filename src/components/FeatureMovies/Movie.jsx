import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 0 },
        items: 1,
    },
};

const Movie = (props) => {
    const { movies } = props;
    return (
        <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={3000}>
            {movies.map((movie) => (
                <div key={movie.id}>
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
                        alt=""
                        className="aspect-video h-custom w-full object-cover brightness-50"
                    />
                    <div className="absolute bottom-[15%] left-8 w-1/2 sm:w-1/3">
                        <div>
                            <h3 className="mb-2 font-bold sm:text-[2vw]">
                                {movie.original_title}
                            </h3>
                            <div className="flex items-center gap-4 text-[1.2vw]">
                                <p>{movie?.release_date}</p>
                            </div>
                        </div>
                        <div>
                            <div className="mt-5 hidden text-[1.2vw] sm:block">
                                <p className="mb-2 text-[1.3vw] font-bold">
                                    Tóm tắt
                                </p>
                                <p>{movie?.overview}</p>
                            </div>
                            <button className="mt-4 rounded bg-slate-300/30 px-4 py-2 text-[10px] lg:text-lg">
                                Thông tin
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};
export default Movie;
