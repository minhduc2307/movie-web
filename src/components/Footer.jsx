import { faFacebookF, faTiktok, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
    return (
        <footer className="py-12 bg-[#171c28] text-white px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-footer mx-auto lg:max-w-screen-xl gap-[60px]">
                <div>
                    <h2 className="uppercase text-red-500 font-bold text-3xl">Mọt phim</h2>
                    <p className="mt-5 max-w-[90%]">
                        Trang web xem phim trực tuyến miễn phí chất lượng cao với giao diện trực quan, tốc độ tải trang
                        nhanh, cùng kho phim với hơn 10.000+ phim mới, phim hay, luôn cập nhật phim nhanh, hứa hẹn sẽ
                        đem lại phút giây thư giãn cho bạn.
                    </p>
                    <p className="mt-8">Nhận thông tin về những bộ phim sắp khởi chiếu</p>
                    <form action="" className="my-4 flex gap-2" autoComplete="off">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Nhập email"
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            className="rounded-md border border-[#d2d1d6] border-solid py-2 px-3 w-full font-medium"
                        />
                        <button className="h-10 flex items-center justify-center px-5 text-lg text-[#171c28] bg-[#ffb700] font-medium rounded-md">
                            Gửi
                        </button>
                    </form>
                </div>
                <div>
                    <h3 className="uppercase text-lg font-bold">Danh mục</h3>
                    <ul className="mt-4">
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim mới
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim chiếu rạp
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim bộ
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim lẻ
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="uppercase text-lg font-bold">Thể loại</h3>
                    <ul className="mt-4">
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim Cổ Trang
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim Hành Động
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim Bách Hợp
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Phim Viễn Tưởng
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="uppercase text-lg font-bold">Điều khoản</h3>
                    <ul className="mt-4">
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                DMCA
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Liên hệ
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Quyền riêng tư
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="inline-block py-1 hover:text-[#0071dc]">
                                Điều khoản dịch vụ
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-between flex-col items-center md:flex-row gap-3 mx-auto lg:max-w-screen-xl mt-10 border-t border-zinc-700 py-3">
                <p>© 2024 Mot Phim. All rights reserved.</p>
                <div className="flex gap-5 items-center">
                    <a
                        href="#!"
                        className="flex justify-center items-center w-8 h-8 rounded-md bg-[#4863a9] hover:-translate-y-1 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faFacebookF} className="w-4" />
                    </a>
                    <a
                        href="#!"
                        className="flex justify-center items-center w-8 h-8 rounded-md bg-[#f00] hover:-translate-y-1 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faYoutube} />
                    </a>
                    <a
                        href="#!"
                        className="flex justify-center items-center w-8 h-8 rounded-md bg-[#000] hover:-translate-y-1 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faTiktok} />
                    </a>
                    <a
                        href="#!"
                        className="flex justify-center items-center w-8 h-8 rounded-md bg-[#4999e6] hover:-translate-y-1 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
