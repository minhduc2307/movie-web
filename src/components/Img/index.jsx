const Img = ({
    src,
    fallbackSrc,
    width,
    height,
    alt = "",
    className,
    loading = "lazy",
    decoding = "async",
    fetchPriority,
    onError,
}) => {
    const handleError = (e) => {
        const img = e?.target;
        if (!img) return;

        if (fallbackSrc && img.dataset.triedFallback !== src && img.src !== fallbackSrc) {
            img.dataset.triedFallback = src;
            img.src = fallbackSrc;
            return;
        }

        if (onError) {
            onError(e);
        } else if (!img.src.endsWith("/NoImage.svg")) {
            img.src = "/NoImage.svg";
        }
    };

    return (
        <img
            src={src}
            width={width}
            height={height}
            alt={alt}
            loading={loading}
            decoding={decoding}
            fetchPriority={fetchPriority}
            className={className}
            onError={handleError}
        />
    );
};

export default Img;
