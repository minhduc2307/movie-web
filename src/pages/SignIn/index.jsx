import { useForm } from "react-hook-form";
import { useUserContext } from "@context/UserProvider";
import Toast, { showSuccessToast } from "@components/Toast";
import { Link, useNavigate } from "react-router-dom";
import "./sign-in.css";

const SignIn = () => {
    const { handleSubmit, register } = useForm();
    const navigate = useNavigate();
    const { setUserInfo } = useUserContext();
    const onSubmit = (data) => {
        const { email } = data;
        setUserInfo({ email });
        showSuccessToast("Thành công", "Đăng nhập thành công");
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    return (
        <div className="signin-container">
            <div className="signin-inner">
                <div className="signin-content">
                    <h1>
                        <Link to="/" className="signin-logo">
                            Mọt phim
                        </Link>
                    </h1>
                    <h2 className="signin-title">Đăng nhập</h2>
                    <p className="signin-subtitle">
                        Chào mừng trở lại. Vui lòng nhập thông tin tài khoản của
                        bạn
                    </p>
                    <form
                        action=""
                        className="signin-form"
                        onSubmit={handleSubmit(onSubmit)}
                        method="POST"
                    >
                        <div className="signin-input-group">
                            <div className="signin-input-wrapper">
                                <input
                                    type="email"
                                    {...register("email")}
                                    id="email"
                                    required
                                    placeholder="Email"
                                    className="signin-input"
                                    autoFocus
                                    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                />
                                <img
                                    src="/message.svg"
                                    alt=""
                                    className="signin-input-icon"
                                />
                            </div>
                        </div>
                        <div className="signin-input-group">
                            <div className="signin-input-wrapper">
                                <input
                                    type="password"
                                    {...register("password")}
                                    id="password"
                                    required
                                    minLength={6}
                                    placeholder="Mật khẩu"
                                    className="h-full w-full"
                                />
                                <img src="/lock.svg" alt="" />
                            </div>
                        </div>
                        <div className="signin-button-wrapper">
                            <button className="signin-button">Đăng nhập</button>
                        </div>
                    </form>
                    <p className="signin-footer">
                        Chưa có tài khoản?
                        <Link to="/sign-up" className="signin-link">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
            <Toast />
        </div>
    );
};

export default SignIn;
