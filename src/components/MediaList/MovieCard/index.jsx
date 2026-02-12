import Img from "@components/Img";
import { Link } from "react-router-dom";
import "./movie-card.css";

const MovieCard = ({ name, year, posterUrl, type, time, slug }) => {
    return (
        <Link to={`/info/${slug}`} className="movie-card-link">
            <article className="movie-card">
                <div className="movie-card-poster-wrapper">
                    {type === "tv" && (
                        <p className="movie-card-tv-badge">TV Show</p>
                    )}
                    <Img
                        src={posterUrl && `https://phimimg.com/${posterUrl}`}
                        width={273}
                        height={273}
                        alt={name || "card-film"}
                        className="movie-card-poster"
                    />
                </div>
                <h3 className="movie-card-title">{name}</h3>
                <div className="movie-card-footer">
                    <p className="movie-card-info">{year}</p>
                    <p className="movie-card-info">{time}</p>
                </div>
            </article>
        </Link>
    );
};
export default MovieCard;
