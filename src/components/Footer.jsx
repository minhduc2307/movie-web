import {
    faFacebookF,
    faTiktok,
    faTwitter,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#171c28] px-6 py-12 text-white">
            <div className="mx-auto grid gap-[60px] sm:grid-cols-2 lg:max-w-screen-xl lg:grid-cols-footer">
                <div>
                    <h2>
                        <Link
                            to="/"
                            className="text-3xl font-bold uppercase text-red-500"
                        >
                            Mọt phim
                        </Link>
                    </h2>
                    <p className="mt-5 max-w-[90%]">
                        Trang web xem phim trực tuyến miễn phí chất lượng cao
                        với giao diện trực quan, tốc độ tải trang nhanh, cùng
                        kho phim với hơn 10.000+ phim mới, phim hay, luôn cập
                        nhật phim nhanh, hứa hẹn sẽ đem lại phút giây thư giãn
                        cho bạn.
                    </p>
                    <p className="mt-8">
                        Nhận thông tin về những bộ phim sắp khởi chiếu
                    </p>
                    <form
                        action=""
                        className="my-4 flex gap-2"
                        autoComplete="off"
                    >
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Nhập email"
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            className="w-full rounded-md border border-solid border-[#d2d1d6] px-3 py-2 font-medium"
                        />
                        <button className="flex h-10 items-center justify-center rounded-md bg-[#ffb700] px-5 text-lg font-medium text-[#171c28]">
                            Gửi
                        </button>
                    </form>
                </div>
                <div>
                    <h3 className="text-lg font-bold uppercase">Danh mục</h3>
                    <ul className="mt-4">
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim mới
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cartoon"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim hoạt hình
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tv"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim bộ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/movie"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim lẻ
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold uppercase">Thể loại</h3>
                    <ul className="mt-4">
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim Cổ Trang
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim Hành Động
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim Bách Hợp
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Phim Viễn Tưởng
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold uppercase">Điều khoản</h3>
                    <ul className="mt-4">
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                DMCA
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Liên hệ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Quyền riêng tư
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#!"
                                className="inline-block py-1 hover:text-[#0071dc]"
                            >
                                Điều khoản dịch vụ
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mx-auto mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-700 py-3 md:flex-row lg:max-w-screen-xl">
                <p>© 2024 Mot Phim. All rights reserved.</p>
                <div className="flex items-center gap-5">
                    <Link
                        to="#!"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4863a9] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <FontAwesomeIcon
                            icon={faFacebookF}
                            className="h-4 w-4"
                        />
                    </Link>
                    <Link
                        to="#!"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f00] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <FontAwesomeIcon icon={faYoutube} className="h-4 w-4" />
                    </Link>
                    <Link
                        to="#!"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-[#000] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <FontAwesomeIcon icon={faTiktok} className="h-4 w-4" />
                    </Link>
                    <Link
                        to="#!"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4999e6] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
