import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
    const [showMenuDrawer, setShowMenuDrawer] = useState(false);

    return (
        <header className="header">
            <button className="header-mobile-menu-button">
                <img
                    src="/more.svg"
                    alt=""
                    className="header-menu-icon"
                    onClick={() => {
                        setShowMenuDrawer(true);
                    }}
                />
            </button>
            <div className="header-logo-container">
                <h1 className="header-logo-wrapper">
                    <Link to="/" className="header-logo">
                        Mọt phim
                    </Link>
                </h1>
                <nav
                    className={`header-nav ${showMenuDrawer ? "header-nav-mobile" : ""}`}
                >
                    <button
                        className={`header-nav-back-button ${showMenuDrawer ? "header-nav-back-button-mobile" : ""}`}
                    >
                        <img
                            src="/back.svg"
                            alt=""
                            className="header-menu-icon"
                            onClick={() => {
                                setShowMenuDrawer(false);
                            }}
                        />
                    </button>
                    <ul className="header-nav-list">
                        <li>
                            <Link
                                to="/movie"
                                className={`header-nav-link ${showMenuDrawer ? "header-nav-link-mobile" : ""}`}
                            >
                                Phim lẻ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tv"
                                className={`header-nav-link ${showMenuDrawer ? "header-nav-link-mobile" : ""}`}
                            >
                                Phim bộ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cartoon"
                                className={`header-nav-link ${showMenuDrawer ? "header-nav-link-mobile" : ""}`}
                            >
                                Phim hoạt hình
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/search"
                                className={`header-search-link-mobile ${showMenuDrawer ? "header-search-link-mobile-active" : ""}`}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Link to="/search" className="header-search-button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Link>
            </div>
            <div className="header-auth-buttons">
                <Link to="/sign-in" className="header-signin-button">
                    Đăng nhập
                </Link>
                <Link to="/sign-up" className="header-signup-button">
                    Đăng ký
                </Link>
            </div>

            <div
                className={`header-overlay ${showMenuDrawer ? "header-overlay-active" : ""}`}
                onClick={() => {
                    setShowMenuDrawer(false);
                }}
            ></div>
        </header>
    );
};
export default Header;
