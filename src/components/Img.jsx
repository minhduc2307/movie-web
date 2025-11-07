import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ src, width, height, alt = "", className }) => {
    return (
        <LazyLoadImage
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={className}
            effect="blur"
            threshold={100}
            wrapperProps={{
                style: { display: "contents" }
            }}
            delayTime={300}
            delayMethod="throttle"
            useIntersectionObserver={true}
            scrollPosition={undefined}
        />
    );
};

export default Img;