import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const VideoPlayer = ({ srcMovie, embedUrl, title }) => {
    const { t } = useTranslation();
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !srcMovie) return;

        let hls = null;
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(srcMovie);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                }
            });

            return () => {
                video.pause();
                hls.destroy();
            };
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = srcMovie;
            const handlePlay = () => {
                video.play().catch(() => {});
            };
            video.addEventListener("loadedmetadata", handlePlay);

            return () => {
                video.removeEventListener("loadedmetadata", handlePlay);
                video.pause();
                video.removeAttribute("src");
                video.load();
            };
        }
    }, [srcMovie]);

    if (srcMovie) {
        return (
            <div className="w-full max-w-6xl 2xl:max-w-[1440px] aspect-video max-h-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
                <video
                    ref={videoRef}
                    className="h-full w-full object-contain"
                    controls
                    autoPlay
                    playsInline
                />
            </div>
        );
    }

    if (embedUrl) {
        return (
            <div className="w-full max-w-6xl 2xl:max-w-[1440px] aspect-video max-h-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
                <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    title={title}
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div className="flex aspect-video w-full max-w-6xl 2xl:max-w-[1440px] max-h-full items-center justify-center rounded-xl bg-black/80 text-slate-400">
            {t("detail.notFound")}
        </div>
    );
};

export default VideoPlayer;
