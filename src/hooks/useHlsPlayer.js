import { useCallback, useEffect, useRef, useState } from "react";

const formatQualityLevels = (hlsLevels = []) => {
    const mapped = hlsLevels
        .map((lvl, index) => {
            const label = lvl.height
                ? `${lvl.height}p`
                : lvl.name || `${Math.round((lvl.bitrate || 0) / 1000)}kbps`;
            return {
                index,
                height: lvl.height || 0,
                bitrate: lvl.bitrate || 0,
                label,
            };
        })
        .sort((a, b) => b.height - a.height || b.bitrate - a.bitrate);

    // Deduplicate identical height labels keeping highest bitrate first
    const seen = new Set();
    return mapped.filter((item) => {
        if (seen.has(item.label)) return false;
        seen.add(item.label);
        return true;
    });
};

/**
 * Manages HLS stream attachment, adaptive quality levels, error recovery,
 * and dynamic loading of `hls.js`.
 */
export const useHlsPlayer = (
    videoRef,
    src,
    { autoPlay = true, onReady, onFatalError } = {}
) => {
    const hlsRef = useRef(null);
    const autoPlayRef = useRef(autoPlay);
    const onReadyRef = useRef(onReady);
    const onFatalErrorRef = useRef(onFatalError);

    autoPlayRef.current = autoPlay;
    onReadyRef.current = onReady;
    onFatalErrorRef.current = onFatalError;

    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1);
    const [isLoadingStream, setIsLoadingStream] = useState(Boolean(src));
    const [errorType, setErrorType] = useState(null);
    const [errorDetail, setErrorDetail] = useState("");
    const [retryNonce, setRetryNonce] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) {
            setLevels([]);
            setCurrentLevel(-1);
            setIsLoadingStream(false);
            setErrorType(null);
            setErrorDetail("");
            return;
        }

        let cancelled = false;
        let hlsInstance = null;
        let nativeCleanup = null;
        let retryTimer = null;

        setIsLoadingStream(true);
        setErrorType(null);
        setErrorDetail("");
        setLevels([]);
        setCurrentLevel(-1);

        const attachNativeHls = () => {
            video.src = src;
            const handleLoaded = () => {
                if (cancelled) return;
                setIsLoadingStream(false);
                onReadyRef.current?.();
                if (autoPlayRef.current) {
                    video.play().catch(() => {});
                }
            };
            const handleNativeError = () => {
                if (cancelled) return;
                if (import.meta.env.DEV) {
                    console.error("[useHlsPlayer] Native HLS error:", video.error);
                }
                setIsLoadingStream(false);
                setErrorType("fatal");
                setErrorDetail(video.error?.message || "NATIVE_MEDIA_ERROR");
                onFatalErrorRef.current?.(video.error);
            };

            video.addEventListener("loadedmetadata", handleLoaded);
            video.addEventListener("error", handleNativeError);

            nativeCleanup = () => {
                video.removeEventListener("loadedmetadata", handleLoaded);
                video.removeEventListener("error", handleNativeError);
                video.pause();
                video.removeAttribute("src");
                video.load();
            };
        };

        const attachStream = async () => {
            try {
                const hlsModule = await import("hls.js");
                if (cancelled) return;

                const Hls = hlsModule?.default || hlsModule?.Hls || hlsModule;
                const hlsSupported = typeof Hls?.isSupported === "function" && Hls.isSupported();

                // Always prefer Hls.isSupported() before falling back to native HLS
                if (!hlsSupported) {
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        attachNativeHls();
                    } else {
                        setIsLoadingStream(false);
                        setErrorType("unsupported");
                        setErrorDetail("HLS_NOT_SUPPORTED");
                        onFatalErrorRef.current?.();
                    }
                    return;
                }

                hlsInstance = new Hls({
                    backBufferLength: 90,
                });
                hlsRef.current = hlsInstance;

                hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
                    if (cancelled || !hlsInstance) return;
                    hlsInstance.loadSource(src);
                });

                hlsInstance.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
                    if (cancelled || !hlsInstance) return;
                    setLevels(formatQualityLevels(data?.levels));
                    setCurrentLevel(hlsInstance.currentLevel ?? -1);
                    setIsLoadingStream(false);
                    onReadyRef.current?.();
                    if (autoPlayRef.current) {
                        video.play().catch(() => {});
                    }
                });

                hlsInstance.on(Hls.Events.LEVEL_SWITCHED, () => {
                    if (cancelled || !hlsInstance) return;
                    if (hlsInstance.autoLevelEnabled) {
                        setCurrentLevel(-1);
                    }
                });

                let networkRetries = 0;
                let mediaRecoveries = 0;

                hlsInstance.on(Hls.Events.FRAG_BUFFERED, () => {
                    networkRetries = 0;
                    mediaRecoveries = 0;
                });

                hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
                    if (cancelled || !data?.fatal || !hlsInstance) return;

                    if (import.meta.env.DEV) {
                        console.error(
                            "[useHlsPlayer] HLS fatal error:",
                            data.type,
                            data.details,
                            data
                        );
                    }

                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetries < 3) {
                        networkRetries += 1;
                        retryTimer = setTimeout(() => {
                            if (!cancelled && hlsInstance) {
                                hlsInstance.startLoad();
                            }
                        }, 400 * networkRetries);
                        return;
                    }

                    if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveries < 3) {
                        mediaRecoveries += 1;
                        if (mediaRecoveries === 2) {
                            hlsInstance.swapAudioCodec();
                        }
                        hlsInstance.recoverMediaError();
                        return;
                    }

                    setIsLoadingStream(false);
                    setErrorType("fatal");
                    setErrorDetail(data.details || data.type || "FATAL_ERROR");
                    hlsInstance.destroy();
                    hlsRef.current = null;
                    onFatalErrorRef.current?.(data);
                });

                hlsInstance.attachMedia(video);
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error("[useHlsPlayer] Failed to initialize player:", err);
                }
                if (!cancelled) {
                    setIsLoadingStream(false);
                    setErrorType("fatal");
                    setErrorDetail(err?.message || "INIT_ERROR");
                    onFatalErrorRef.current?.(err);
                }
            }
        };

        attachStream();

        return () => {
            cancelled = true;
            if (retryTimer) {
                clearTimeout(retryTimer);
            }
            if (nativeCleanup) {
                nativeCleanup();
            }
            if (hlsInstance) {
                video.pause();
                hlsInstance.destroy();
                hlsRef.current = null;
            }
        };
    }, [videoRef, src, retryNonce]);

    const setQualityLevel = useCallback((levelIndex) => {
        const hls = hlsRef.current;
        if (!hls) return;
        hls.currentLevel = levelIndex;
        setCurrentLevel(levelIndex);
    }, []);

    const retryLoad = useCallback(() => {
        setRetryNonce((n) => n + 1);
    }, []);

    return {
        levels,
        currentLevel,
        setQualityLevel,
        isLoadingStream,
        errorType,
        errorDetail,
        retryLoad,
    };
};
