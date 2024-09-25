const NotFound = () => {
    return (
        <div className="relative min-h-[100vh] bg-[#1E1E1E]">
            <img
                src="/moon.svg"
                alt=""
                className="absolute left-0 hidden brightness-[0.4] xl:block"
            />
            <div className="relative flex justify-center">
                <div className="mt-20 flex flex-col items-center">
                    <p className="text-9xl text-[#D7D5E4]">404</p>
                    <p className="mt-8 text-center text-6xl text-[#9E9BB2]">
                        Không tìm thấy trang!
                    </p>
                    <a
                        href="/"
                        className="mt-10 flex items-center gap-1 text-3xl text-white"
                    >
                        <img src="/back.svg" alt="" className="invert" />
                        Về trang chủ
                    </a>
                </div>
            </div>
            <img
                src="/astronaut.svg"
                alt=""
                className="absolute bottom-[10%] right-0 hidden brightness-[0.4] xl:block"
            />
        </div>
    );
};

export default NotFound;
