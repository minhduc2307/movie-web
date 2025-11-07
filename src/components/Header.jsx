import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [showMenuDrawer, setShowMenuDrawer] = useState(false);

    return (
        <header className="sticky top-0 z-[8] flex justify-between bg-slate-950 px-5 py-5 font-medium text-white lg:px-8">
            <button className="lg:hidden">
                <img
                    src="/more.svg"
                    alt=""
                    className="brightness-[1.08] contrast-[1.07] hue-rotate-[42deg] invert saturate-100 sepia"
                    onClick={() => {
                        setShowMenuDrawer(true);
                    }}
                />
            </button>
            <div className="flex items-center">
                <h1 className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] lg:static lg:translate-x-0 lg:translate-y-0">
                    <Link
                        to="/"
                        className="text-2xl font-bold uppercase text-red-500 md:text-3xl"
                    >
                        Mọt phim
                    </Link>
                </h1>
                <nav
                    className={`-translate-x-full lg:mx-6 lg:translate-x-0 ${showMenuDrawer ? "fixed bottom-0 left-0 right-1/4 top-0 z-10 !block translate-x-0 bg-[#292e39] py-5 shadow-lg shadow-[#171c2866] transition-transform duration-500" : ""}`}
                >
                    <button
                        className={`hidden px-5 pb-3 ${showMenuDrawer ? "!block" : ""}`}
                    >
                        <img
                            src="/back.svg"
                            alt=""
                            className="brightness-[1.08] contrast-[1.07] hue-rotate-[42deg] invert saturate-100 sepia"
                            onClick={() => {
                                setShowMenuDrawer(false);
                            }}
                        />
                    </button>
                    <ul className="flex flex-col px-5 lg:flex-row lg:gap-6">
                        <li>
                            <Link
                                to="/movie"
                                className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-3" : ""}`}
                            >
                                Phim lẻ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tv"
                                className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-3" : ""}`}
                            >
                                Phim bộ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cartoon"
                                className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-3" : ""}`}
                            >
                                Phim hoạt hình
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/search"
                                className={`hidden ${showMenuDrawer ? "!flex h-full items-center rounded-lg py-3 shadow-[#00000033] lg:h-12 lg:w-12 lg:justify-center lg:py-0" : ""}`}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Link
                    to="/search"
                    className="ml-10 hidden h-12 w-12 items-center justify-center rounded-lg bg-[#292d38] shadow-[#00000033] lg:flex"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Link>
            </div>
            <div className="flex items-center gap-5">
                <Link
                    to="/sign-in"
                    className="hidden items-center justify-center px-5 lg:flex lg:h-11 lg:text-lg"
                >
                    Đăng nhập
                </Link>
                <Link
                    to="/sign-up"
                    className="flex h-10 items-center justify-center rounded-2xl bg-[#ffb700] px-2 text-[#171c28] lg:ml-5 lg:h-11 lg:px-5 lg:text-lg"
                >
                    Đăng ký
                </Link>
            </div>

            <div
                className={`hidden opacity-0 ${showMenuDrawer ? "fixed inset-0 z-[9] !block bg-black/30 opacity-100 transition-opacity" : ""}`}
                onClick={() => {
                    setShowMenuDrawer(false);
                }}
            ></div>
        </header>
    );
};
export default Header;
