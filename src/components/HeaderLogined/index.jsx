import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./header-logined.css";

const HeaderLogined = ({ userInfo, setUserInfo }) => {
    const [showMenuDrawer, setShowMenuDrawer] = useState(false);

    return (
        <header className="header-logined">
            <button className="header-logined-mobile-menu-button">
                <img
                    src="/more.svg"
                    alt=""
                    className="header-logined-menu-icon"
                    onClick={() => {
                        setShowMenuDrawer(true);
                    }}
                />
            </button>
            <div className="header-logined-logo-container">
                <h1 className="header-logined-logo-wrapper">
                    <Link to="/" className="header-logined-logo">
                        Mọt phim
                    </Link>
                </h1>
                <nav
                    className={`header-logined-nav ${
                        showMenuDrawer ? "header-logined-nav-mobile" : ""
                    }`}
                >
                    <button
                        className={`header-logined-nav-back-button ${
                            showMenuDrawer
                                ? "header-logined-nav-back-button-mobile"
                                : ""
                        }`}
                    >
                        <img
                            src="/back.svg"
                            alt=""
                            className="header-logined-menu-icon"
                            onClick={() => {
                                setShowMenuDrawer(false);
                            }}
                        />
                    </button>
                    <ul className="header-logined-nav-list">
                        <li>
                            <Link
                                to="/movie"
                                className={`header-logined-nav-link ${
                                    showMenuDrawer
                                        ? "header-logined-nav-link-mobile"
                                        : ""
                                }`}
                            >
                                Phim lẻ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tv"
                                className={`header-logined-nav-link ${
                                    showMenuDrawer
                                        ? "header-logined-nav-link-mobile"
                                        : ""
                                }`}
                            >
                                Phim bộ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cartoon"
                                className={`header-logined-nav-link ${
                                    showMenuDrawer
                                        ? "header-logined-nav-link-mobile"
                                        : ""
                                }`}
                            >
                                Phim hoạt hình
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/search"
                                className={`header-logined-search-link-mobile ${
                                    showMenuDrawer
                                        ? "header-logined-search-link-mobile-active"
                                        : ""
                                }`}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Link to="/search" className="header-logined-search-button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Link>
            </div>
            <div className="header-logined-profile-wrapper group">
                <img
                    src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833560.jpg?w=740&t=st=1728638508~exp=1728639108~hmac=59fcbd89a8d344fb2797ab35306b6b539a477e5dd919d73e04bd449290c3a5f4"
                    alt=""
                    className="header-logined-profile-avatar"
                />
                <div className="header-logined-profile-dropdown group-hover:block">
                    <div className="header-logined-profile-dropdown-content">
                        <div className="header-logined-profile-dropdown-arrow"></div>
                        <div className="header-logined-profile-info">
                            <img
                                src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833560.jpg?w=740&t=st=1728638508~exp=1728639108~hmac=59fcbd89a8d344fb2797ab35306b6b539a477e5dd919d73e04bd449290c3a5f4"
                                alt=""
                                className="header-logined-profile-info-avatar"
                            />
                            <div>
                                <p className="header-logined-profile-info-name">
                                    User
                                </p>
                                <p>{userInfo?.email}</p>
                            </div>
                        </div>
                        <ul className="header-logined-profile-menu">
                            <li>
                                <Link
                                    to="#!"
                                    className="header-logined-profile-menu-link"
                                >
                                    Trang cá nhân
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/favorite"
                                    className="header-logined-profile-menu-link"
                                >
                                    Danh sách yêu thích
                                </Link>
                            </li>
                            <li className="header-logined-profile-menu-divider">
                                <Link
                                    to="#!"
                                    className="header-logined-profile-menu-link"
                                    onClick={() => setUserInfo(null)}
                                >
                                    Đăng xuất
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                className={`header-logined-overlay ${
                    showMenuDrawer ? "header-logined-overlay-active" : ""
                }`}
                onClick={() => {
                    setShowMenuDrawer(false);
                }}
            ></div>
        </header>
    );
};
export default HeaderLogined;
