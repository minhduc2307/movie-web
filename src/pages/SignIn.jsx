const SignIn = () => {
    return (
        <div className="flex h-[100vh]">
            <div className="w-content-inner mx-auto px-5 py-20 lg:py-40">
                <div className="flex flex-col items-center">
                    <h1>
                        <a
                            href="/"
                            className="text-3xl font-bold uppercase text-red-500"
                        >
                            Mọt phim
                        </a>
                    </h1>
                    <h2 className="mt-10 text-3xl text-[#010101]">Đăng nhập</h2>
                    <p className="mt-3 text-center text-[#777e90]">
                        Chào mừng trở lại. Vui lòng nhập thông tin tài khoản của
                        bạn
                    </p>
                    <form action="" className="mt-7 w-full">
                        <div className="mt-6">
                            <div className="flex h-12 items-center rounded-xl border-2 border-solid border-[#d9d9d9] px-3 focus-within:border-[#77dae6]">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    placeholder="Email"
                                    className="h-full w-full text-base"
                                    autoFocus
                                    pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
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
                                    name="password"
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
                        <a
                            href="/sign-up"
                            className="font-medium text-[#0166ff]"
                        >
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
