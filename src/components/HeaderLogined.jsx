import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

const HeaderLogined = ({ userInfo, setUserInfo }) => {
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
                    className={`-translate-x-full lg:mx-6 lg:translate-x-0 ${showMenuDrawer
                        ? "fixed bottom-0 left-0 right-1/4 top-0 z-10 !block translate-x-0 bg-[#292e39] py-5 shadow-lg shadow-[#171c2866] transition-transform duration-500"
                        : ""
                        }`}
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
                                className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-3" : ""
                                    }`}
                            >
                                Phim lẻ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tv"
                                className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-3" : ""
                                    }`}
                            >
                                Phim bộ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cartoon"
                                className={`hidden md:text-lg lg:block lg:py-0 ${showMenuDrawer ? "!inline-block py-3" : ""
                                    }`}
                            >
                                Phim hoạt hình
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/search"
                                className={`hidden ${showMenuDrawer
                                    ? "!flex h-full items-center rounded-lg py-3 shadow-[#00000033] lg:h-12 lg:w-12 lg:justify-center lg:py-0"
                                    : ""
                                    }`}
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
            <div className="group relative">
                <img
                    src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833560.jpg?w=740&t=st=1728638508~exp=1728639108~hmac=59fcbd89a8d344fb2797ab35306b6b539a477e5dd919d73e04bd449290c3a5f4"
                    alt=""
                    className="block h-[50px] w-[50px] cursor-pointer rounded-lg object-cover"
                />
                <div className="absolute right-0 top-12 hidden w-[300px] pt-6 group-hover:block">
                    <div className="rounded-2xl bg-[#2f3441] p-8 shadow-sm shadow-slate-600">
                        <div className="absolute -top-3 right-2 inline-block border-[20px] border-b-[#2e3340] border-l-transparent border-r-transparent border-t-transparent"></div>
                        <div className="flex items-center gap-3">
                            <img
                                src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833560.jpg?w=740&t=st=1728638508~exp=1728639108~hmac=59fcbd89a8d344fb2797ab35306b6b539a477e5dd919d73e04bd449290c3a5f4"
                                alt=""
                                className="h-[60px] w-[60px] rounded-xl object-cover"
                            />
                            <div>
                                <p className="text-lg">User</p>
                                <p>{userInfo?.email}</p>
                            </div>
                        </div>
                        <ul className="mt-8">
                            <li>
                                <Link to="#!" className="inline-block py-2">
                                    Trang cá nhân
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/favorite"
                                    className="inline-block py-2"
                                >
                                    Danh sách yêu thích
                                </Link>
                            </li>
                            <li className="mt-3 border-t border-solid border-t-[#292e39] pt-3">
                                <Link
                                    to="#!"
                                    className="inline-block py-2"
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
                className={`hidden opacity-0 ${showMenuDrawer
                    ? "fixed inset-0 z-[9] !block bg-black/30 opacity-100 transition-opacity"
                    : ""
                    }`}
                onClick={() => {
                    setShowMenuDrawer(false);
                }}
            ></div>
        </header>
    );
};
export default HeaderLogined;
