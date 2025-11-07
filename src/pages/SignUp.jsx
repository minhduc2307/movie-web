import Toast, { showSuccessToast } from "@components/Toast/Toast";
import { useUserContext } from "@context/UserProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
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
        <div className="flex h-[100vh] lg:items-center">
            <div className="mx-auto w-content-inner px-5 py-10">
                <div className="flex flex-col items-center">
                    <h1>
                        <Link
                            to="/"
                            className="text-3xl font-bold uppercase text-red-500"
                        >
                            Mọt phim
                        </Link>
                    </h1>
                    <h2 className="mt-10 text-3xl text-[#010101]">Đăng ký</h2>
                    <p className="mt-3 text-center text-[#777e90]">
                        Hãy tạo tài khoản và bắt đầu trải nghiệm cùng chúng tôi
                    </p>
                    <form
                        action=""
                        className="mt-7 w-full"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="mt-6">
                            <div className="flex h-12 items-center rounded-xl border-2 border-solid border-[#d9d9d9] px-3 focus-within:border-[#77dae6]">
                                <input
                                    type="email"
                                    {...register("email")}
                                    id="email"
                                    required
                                    placeholder="Email"
                                    className="h-full w-full text-base"
                                    autoFocus
                                    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                />
                                <img
                                    src="/message.svg"
                                    alt=""
                                    className="ml-3"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex h-12 items-center rounded-xl border-2 border-solid border-[#d9d9d9] px-3 focus-within:border-[#77dae6]">
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
                        <div className="mt-6">
                            <div
                                className={`flex h-12 items-center rounded-xl border-2 border-solid border-[#d9d9d9] px-3 focus-within:border-[#77dae6] ${errorMessage ? "border-[#ed4337]" : ""}`}
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
                            <p className="mt-2 text-sm font-medium text-red-500">
                                {errorMessage}
                            </p>
                        )}
                        <div className="mt-10">
                            <button className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#0166ff] px-5 text-white">
                                Đăng ký
                            </button>
                        </div>
                    </form>
                    <p className="mt-7 flex gap-1">
                        Đã có tài khoản?
                        <Link
                            to="/sign-in"
                            className="font-medium text-[#0166ff]"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
            <Toast />
        </div>
    );
};

export default SignIn;
