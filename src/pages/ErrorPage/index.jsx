import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error("Route error:", error);

    const errorMessage =
        error?.statusText || error?.message || "Đã xảy ra sự cố ngoài ý muốn.";

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
            <div className="max-w-md text-center">
                <h1 className="mb-4 text-6xl font-extrabold text-primary">
                    {error?.status || "Lỗi"}
                </h1>
                <h2 className="mb-2 text-2xl font-bold">
                    Có lỗi xảy ra trong quá trình tải trang
                </h2>
                <p className="mb-6 text-muted-foreground">{errorMessage}</p>
                <Link
                    to="/"
                    className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                    Trở về Trang chủ
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
