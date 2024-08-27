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
                        className="aspect-video brightness-50 w-full h-custom object-cover"
                    />
                    <div className="absolute bottom-[15%] left-8 w-1/2 sm:w-1/3">
                        <div>
                            <h3 className="font-bold sm:text-[2vw] mb-2">{movie.original_title}</h3>
                            <div className="flex items-center gap-4 text-[1.2vw]">
                                <p className="text-gray-400 border border-[#d2d1d6] inline-block p-2">18+</p>
                                <p className="">{movie?.release_date}</p>
                            </div>
                        </div>
                        <div>
                            <div className="hidden sm:block text-[1.2vw] mt-5">
                                <p className="font-bold mb-2 text-[1.3vw]">Overview</p>
                                <p>{movie?.overview}</p>
                            </div>
                            <button className="mt-4 bg-slate-300/30 rounded py-2 px-4 text-[10px] lg:text-lg">
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
