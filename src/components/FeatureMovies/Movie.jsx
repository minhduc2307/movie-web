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
                <div key={movie._id}>
                    <img
                        src={`https://phimimg.com/${movie?.thumb_url}`}
                        alt=""
                        className="aspect-video h-custom w-full object-cover brightness-50"
                    />
                    <div className="absolute bottom-[15%] left-8">
                        <div>
                            <h3 className="mb-2 text-3xl font-bold lg:text-4xl">
                                {movie?.name}
                            </h3>
                            <div className="flex items-center gap-4 text-xl lg:text-2xl">
                                <p>{movie?.year}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xl">{movie.time}</p>
                            <button className="mt-4 rounded bg-slate-300/30 px-4 py-2 lg:text-lg">
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
