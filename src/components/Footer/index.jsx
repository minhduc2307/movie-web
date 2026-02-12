import {
    faFacebookF,
    faTiktok,
    faTwitter,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <h2>
                        <Link to="/" className="footer-logo">
                            Mọt phim
                        </Link>
                    </h2>
                    <p className="footer-description">
                        Trang web xem phim trực tuyến miễn phí chất lượng cao
                        với giao diện trực quan, tốc độ tải trang nhanh, cùng
                        kho phim với hơn 10.000+ phim mới, phim hay, luôn cập
                        nhật phim nhanh, hứa hẹn sẽ đem lại phút giây thư giãn
                        cho bạn.
                    </p>
                    <p className="footer-subscribe-text">
                        Nhận thông tin về những bộ phim sắp khởi chiếu
                    </p>
                    <form action="" className="footer-form" autoComplete="off">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Nhập email"
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            className="footer-input"
                        />
                        <button className="footer-submit-button">Gửi</button>
                    </form>
                </div>
                <div>
                    <h3 className="footer-section-title">Danh mục</h3>
                    <ul className="footer-menu">
                        <li>
                            <Link to="#!" className="footer-link">
                                Phim mới
                            </Link>
                        </li>
                        <li>
                            <Link to="/cartoon" className="footer-link">
                                Phim hoạt hình
                            </Link>
                        </li>
                        <li>
                            <Link to="/tv" className="footer-link">
                                Phim bộ
                            </Link>
                        </li>
                        <li>
                            <Link to="/movie" className="footer-link">
                                Phim lẻ
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-section-title">Thể loại</h3>
                    <ul className="footer-menu">
                        <li>
                            <Link to="#!" className="footer-link">
                                Phim Cổ Trang
                            </Link>
                        </li>
                        <li>
                            <Link to="#!" className="footer-link">
                                Phim Hành Động
                            </Link>
                        </li>
                        <li>
                            <Link to="#!" className="footer-link">
                                Phim Bách Hợp
                            </Link>
                        </li>
                        <li>
                            <Link to="#!" className="footer-link">
                                Phim Viễn Tưởng
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-section-title">Điều khoản</h3>
                    <ul className="footer-menu">
                        <li>
                            <Link to="#!" className="footer-link">
                                DMCA
                            </Link>
                        </li>
                        <li>
                            <Link to="#!" className="footer-link">
                                Liên hệ
                            </Link>
                        </li>
                        <li>
                            <Link to="#!" className="footer-link">
                                Quyền riêng tư
                            </Link>
                        </li>
                        <li>
                            <Link to="#!" className="footer-link">
                                Điều khoản dịch vụ
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 Mot Phim. All rights reserved.</p>
                <div className="footer-social-links">
                    <Link
                        to="#!"
                        className="footer-social-link footer-facebook"
                    >
                        <FontAwesomeIcon
                            icon={faFacebookF}
                            className="footer-social-icon"
                        />
                    </Link>
                    <Link to="#!" className="footer-social-link footer-youtube">
                        <FontAwesomeIcon
                            icon={faYoutube}
                            className="footer-social-icon"
                        />
                    </Link>
                    <Link to="#!" className="footer-social-link footer-tiktok">
                        <FontAwesomeIcon
                            icon={faTiktok}
                            className="footer-social-icon"
                        />
                    </Link>
                    <Link to="#!" className="footer-social-link footer-twitter">
                        <FontAwesomeIcon
                            icon={faTwitter}
                            className="footer-social-icon"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
