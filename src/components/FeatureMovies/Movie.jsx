import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2, // optional, default to 1.
    },
};

const Movie = ({ movies }) => {
    return (
        <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={3000}>
            {movies.map((movie) => (
                <div key={movie._id} className="h-full w-full">
                    <img
                        src={movie?.thumb_url}
                        alt=""
                        className="h-full w-full object-cover brightness-50"
                    />
                    <div className="absolute bottom-[15%] left-8">
                        <div>
                            <h3 className="mb-1 text-xl font-bold">
                                {movie?.name}
                            </h3>
                            <p className="text-lg">{movie?.year}</p>
                        </div>
                        <div>
                            <a
                                href={`/info/${movie.slug}`}
                                className="mt-3 inline-block rounded bg-slate-300/30 px-4 py-2 lg:text-lg"
                            >
                                Thông tin
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};
export default Movie;
