import { API_BASE_URL } from "./endpoints.js";

export class HttpError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.data = data;
    }
}

/**
 * Builds a query string from a params object, omitting undefined, null, or empty string values.
 */
export const buildQueryString = (params) => {
    if (!params) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });
    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
};

const inFlightRequests = new Map();
const responseCache = new Map();
const DEFAULT_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * HttpClient wrapper with timeout, params serializer, request deduplication,
 * short-TTL caching, AbortSignal support, and error handling.
 */
export const httpClient = {
    async get(
        endpoint,
        { params, signal, timeout = 10000, headers = {}, cache = false } = {}
    ) {
        const queryString = buildQueryString(params);
        const url =
            endpoint.startsWith("http://") || endpoint.startsWith("https://")
                ? `${endpoint}${queryString}`
                : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}${queryString}`;

        if (cache && !signal) {
            const cached = responseCache.get(url);
            if (cached && Date.now() - cached.timestamp < DEFAULT_CACHE_TTL_MS) {
                return cached.data;
            }
            if (inFlightRequests.has(url)) {
                return inFlightRequests.get(url);
            }
        }

        const executeRequest = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const onAbort = () => controller.abort();
            if (signal) {
                if (signal.aborted) {
                    controller.abort();
                } else {
                    signal.addEventListener("abort", onAbort, { once: true });
                }
            }

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        ...headers,
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch {
                        errorData = null;
                    }
                    throw new HttpError(
                        `HTTP error! status: ${response.status}`,
                        response.status,
                        errorData
                    );
                }

                const data = await response.json();
                if (cache && !signal) {
                    responseCache.set(url, { data, timestamp: Date.now() });
                }
                return data;
            } catch (error) {
                if (error.name === "AbortError") {
                    if (signal?.aborted) {
                        throw error;
                    }
                    throw new Error(`Request timed out after ${timeout}ms`);
                }
                throw error;
            } finally {
                clearTimeout(timeoutId);
                if (signal) {
                    signal.removeEventListener("abort", onAbort);
                }
            }
        };

        if (cache && !signal) {
            const promise = executeRequest().finally(() => {
                inFlightRequests.delete(url);
            });
            inFlightRequests.set(url, promise);
            return promise;
        }

        return executeRequest();
    },
};
