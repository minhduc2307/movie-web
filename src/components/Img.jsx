import { useEffect, useState } from "react";

const Img = ({ src, width, height, alt = "", className }) => {
    const [currentSrc, setCurrentSrc] = useState(
        `https://placehold.co/${width}x${height}?text=Loading`,
    );

    useEffect(() => {
        const img = new Image();
        if (src) {
            img.src = src;
            img.onload = () => {
                setCurrentSrc(src);
            };
            return;
        }

        setCurrentSrc(`https://placehold.co/${width}x${height}?text=No Image`);

        return () => {
            img.onload = null;
        };
    }, [src, width, height]);

    return (
        <img
            src={currentSrc}
            width={width}
            height={height}
            alt={alt}
            className={
                src === currentSrc || !src ? className : `${className} blur-md`
            }
        />
    );
};

export default Img;
