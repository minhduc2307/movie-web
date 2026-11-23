import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ src, width, height, alt = "", className, onError }) => {
    const handleError = (e) => {
        if (onError) {
            onError(e);
        } else if (e?.target && !e.target.src.endsWith("/NoImage.svg")) {
            e.target.src = "/NoImage.svg";
        }
    };

    return (
        <LazyLoadImage
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={className}
            effect="blur"
            threshold={100}
            wrapperClassName="!block w-full h-full"
            delayTime={300}
            delayMethod="throttle"
            useIntersectionObserver={true}
            scrollPosition={undefined}
            onError={handleError}
        />
    );
};

export default Img;
