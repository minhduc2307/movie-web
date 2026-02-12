import { Link } from "react-router-dom";
import "./not-found.css";

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img src="/moon.svg" alt="" className="not-found-moon" />
            <div className="not-found-content-wrapper">
                <div className="not-found-content">
                    <p className="not-found-code">404</p>
                    <p className="not-found-message">Không tìm thấy trang!</p>
                    <Link to="/" className="not-found-home-link">
                        <img
                            src="/back.svg"
                            alt=""
                            className="not-found-home-icon"
                        />
                        Về trang chủ
                    </Link>
                </div>
            </div>
            <img src="/astronaut.svg" alt="" className="not-found-astronaut" />
        </div>
    );
};

export default NotFound;
