import Toast, { showSuccessToast } from "@components/Toast";
import { useUserContext } from "@context/UserProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./sign-up.css";

const SignUp = () => {
    const { handleSubmit, register } = useForm();
    const navigate = useNavigate();
    const [registeredPassword, setRegisteredPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { setUserInfo } = useUserContext();

    const onSubmit = (data) => {
        if (registeredPassword !== confirmedPassword) {
            setErrorMessage("Mật khẩu không trùng khớp vui lòng nhập lại");
            return;
        }
        setErrorMessage("");
        const { email } = data;
        setUserInfo({ email });
        showSuccessToast("Thành công", "Đăng ký thành công");
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    return (
        <div className="signup-container">
            <div className="signup-inner">
                <div className="signup-content">
                    <h1>
                        <Link to="/" className="signup-logo">
                            Mọt phim
                        </Link>
                    </h1>
                    <h2 className="signup-title">Đăng ký</h2>
                    <p className="signup-subtitle">
                        Hãy tạo tài khoản và bắt đầu trải nghiệm cùng chúng tôi
                    </p>
                    <form
                        action=""
                        className="signup-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="signup-input-group">
                            <div className="signup-input-wrapper">
                                <input
                                    type="email"
                                    {...register("email")}
                                    id="email"
                                    required
                                    placeholder="Email"
                                    className="signup-input"
                                    autoFocus
                                    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                />
                                <img
                                    src="/message.svg"
                                    alt=""
                                    className="signup-input-icon"
                                />
                            </div>
                        </div>
                        <div className="signup-input-group">
                            <div className="signup-input-wrapper">
                                <input
                                    type="password"
                                    {...register("password")}
                                    id="password"
                                    required
                                    minLength={6}
                                    placeholder="Mật khẩu"
                                    className="h-full w-full"
                                    onChange={(e) => {
                                        setRegisteredPassword(e.target.value);
                                    }}
                                />
                                <img src="/lock.svg" alt="" />
                            </div>
                        </div>
                        <div className="signup-input-group">
                            <div
                                className={
                                    errorMessage
                                        ? "signup-input-wrapper-error"
                                        : "signup-input-wrapper"
                                }
                            >
                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    required
                                    minLength={6}
                                    placeholder="Nhập lại mật khẩu"
                                    className="h-full w-full"
                                    onChange={(e) => {
                                        setConfirmedPassword(e.target.value);
                                    }}
                                />
                                <img src="/lock.svg" alt="" />
                            </div>
                        </div>
                        {errorMessage && (
                            <p className="signup-error-message">
                                {errorMessage}
                            </p>
                        )}
                        <div className="signup-button-wrapper">
                            <button className="signup-button">Đăng ký</button>
                        </div>
                    </form>
                    <p className="signup-footer">
                        Đã có tài khoản?
                        <Link to="/sign-in" className="signup-link">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
            <Toast />
        </div>
    );
};

export default SignUp;
