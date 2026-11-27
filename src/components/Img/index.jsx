const Img = ({ src, width, height, alt = "", className, onError }) => {
    const handleError = (e) => {
        if (onError) {
            onError(e);
        } else if (e?.target && !e.target.src.endsWith("/NoImage.svg")) {
            e.target.src = "/NoImage.svg";
        }
    };

    return (
        <img
            src={src}
            width={width}
            height={height}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={className}
            onError={handleError}
        />
    );
};

export default Img;
