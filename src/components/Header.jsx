import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Header = () => {
    const [showMenuDrawer, setShowMenuDrawer] = useState(false);

    return (
        <div>
            <header className="relative flex justify-between bg-slate-950 px-8 py-5 font-medium text-white">
                <button className="lg:hidden">
                    <img
                        src="/more.svg"
                        alt=""
                        className="brightness-0 brightness-[1.08] contrast-[1.07] hue-rotate-[42deg] invert saturate-100 sepia"
                        onClick={() => {
                            setShowMenuDrawer(true);
                        }}
                    />
                </button>
                <div className="flex items-center">
                    <h1 className="text-lg font-bold uppercase text-red-500 md:text-3xl">
                        <a href="/">Mọt phim</a>
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
                                className="brightness-0 brightness-[1.08] contrast-[1.07] hue-rotate-[42deg] invert saturate-100 sepia"
                                onClick={() => {
                                    setShowMenuDrawer(false);
                                }}
                            />
                        </button>
                        <ul className="flex flex-col px-5 lg:flex-row lg:gap-4">
                            <li>
                                <a
                                    href="#!"
                                    className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-2" : ""}`}
                                >
                                    Phim
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#!"
                                    className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-2" : ""}`}
                                >
                                    TV
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#!"
                                    className={`hidden ${showMenuDrawer ? "!flex h-full items-center rounded-lg py-2 shadow-[#00000033] lg:h-12 lg:w-12 lg:justify-center lg:py-0" : ""}`}
                                >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <a
                        href="#!"
                        className="ml-10 hidden h-12 w-12 items-center justify-center rounded-lg bg-[#292d38] shadow-[#00000033] lg:flex"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </a>
                </div>
                <div className="flex items-center gap-5">
                    <a
                        href="#!"
                        className="hidden items-center justify-center px-5 lg:flex lg:h-11 lg:text-lg"
                    >
                        Đăng nhập
                    </a>
                    <a
                        href="#!"
                        className="flex h-10 items-center justify-center rounded-2xl bg-[#ffb700] px-2 text-[#171c28] lg:ml-5 lg:h-11 lg:px-5 lg:text-lg"
                    >
                        Đăng ký
                    </a>
                </div>

                <div
                    className={`hidden opacity-0 ${showMenuDrawer ? "fixed inset-0 z-[9] !block bg-black/30 opacity-100 transition-opacity" : ""}`}
                    onClick={() => {
                        setShowMenuDrawer(false);
                    }}
                ></div>
            </header>
        </div>
    );
};
export default Header;
