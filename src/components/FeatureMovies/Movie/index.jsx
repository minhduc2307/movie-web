import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "@components/FeatureMovies/carousel.css";
import Img from "@components/Img";
import { Link } from "react-router-dom";
import "./movie.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2,
    },
};

const Movie = ({ movies, height }) => {
    return (
        <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={4000}
            shouldResetAutoplay
            showDots
            infinite={true}
            arrows={false}
        >
            {movies.map((movie) => (
                <div
                    key={movie._id}
                    className="feature-movie-item"
                    style={{ height: `${height}px` }}
                >
                    <Img
                        src={movie?.thumb_url}
                        width={634}
                        height={height || 357}
                        className="feature-movie-image"
                    />
                    <div className="feature-movie-info">
                        <div>
                            <h3 className="feature-movie-title">
                                {movie?.name}
                            </h3>
                            <p className="feature-movie-year">{movie?.year}</p>
                        </div>
                        <div>
                            <Link
                                to={`/info/${movie.slug}`}
                                className="feature-movie-link"
                            >
                                Thông tin
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};
export default Movie;
