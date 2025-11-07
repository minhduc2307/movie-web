import { useForm } from "react-hook-form";
import { useUserContext } from "@context/UserProvider";
import Toast, { showSuccessToast } from "@components/Toast/Toast";
import { Link, useNavigate } from "react-router-dom";

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
        <div className="flex h-[100vh] lg:items-center">
            <div className="mx-auto w-content-inner px-5 py-20">
                <div className="flex flex-col items-center">
                    <h1>
                        <Link
                            to="/"
                            className="text-3xl font-bold uppercase text-red-500"
                        >
                            Mọt phim
                        </Link>
                    </h1>
                    <h2 className="mt-10 text-3xl text-[#010101]">Đăng nhập</h2>
                    <p className="mt-3 text-center text-[#777e90]">
                        Chào mừng trở lại. Vui lòng nhập thông tin tài khoản của
                        bạn
                    </p>
                    <form
                        action=""
                        className="mt-7 w-full"
                        onSubmit={handleSubmit(onSubmit)}
                        method="POST"
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
                                />
                                <img src="/lock.svg" alt="" />
                            </div>
                        </div>
                        <div className="mt-10">
                            <button className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#0166ff] px-5 text-white">
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                    <p className="mt-7 flex gap-1">
                        Chưa có tài khoản?
                        <Link
                            to="/sign-up"
                            className="font-medium text-[#0166ff]"
                        >
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
