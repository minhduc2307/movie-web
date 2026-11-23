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
            <video
                ref={videoRef}
                className="max-h-full w-full aspect-video rounded-xl bg-black shadow-2xl ring-1 ring-white/10"
                controls
                autoPlay
                playsInline
            />
        );
    }

    if (embedUrl) {
        return (
            <iframe
                src={embedUrl}
                className="max-h-full w-full aspect-video rounded-xl bg-black shadow-2xl ring-1 ring-white/10"
                title={title}
                allowFullScreen
            />
        );
    }

    return (
        <div className="flex aspect-video max-h-full w-full items-center justify-center rounded-xl bg-black/80 text-slate-400">
            {t("detail.notFound")}
        </div>
    );
};

export default VideoPlayer;
