import axios from "axios";

// Resolve API base from CRA environment variables
export const API_BASE =
  process.env.REACT_APP_BACKEND_URL || "https://api-consumet-org-8.onrender.com";

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // Confirm connection in dev console
  // eslint-disable-next-line no-console
  console.log("✅ Connected to custom backend:", API_BASE);
}

// Normalize URLs in responses (basic fixes for http -> https, known CDN domains)
function normalizeUrls(obj) {
  if (!obj) return obj;
  if (typeof obj === "string") {
    let s = obj;
    if (s.startsWith("http://")) s = s.replace("http://", "https://");
    // Common legacy CDN alias fix (best-effort)
    s = s.replace("gogocdn", "gogoplay");
    return s;
  }
  if (Array.isArray(obj)) return obj.map(normalizeUrls);
  if (typeof obj === "object") {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = normalizeUrls(obj[k]);
    return out;
  }
  return obj;
}

export const api = axios.create({
  baseURL: API_BASE,
  // Axios uses withCredentials=false by default; explicitly set for clarity
  withCredentials: false,
  // Allow for cold starts on serverless/onrender backends
  timeout: 45000,
  headers: {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
  // For fetch, we'd set mode: 'cors'. Axios uses XHR/fetch under the hood with CORS by default.
});

// --- Response interceptor: normalize URLs and add simple retry/backoff on transient failures ---
api.interceptors.response.use(
  (res) => {
    try {
      res.data = normalizeUrls(res.data);
    } catch {}
    return res;
  },
  async (error) => {
    const cfg = error.config || {};
    // Only retry idempotent GETs to our backend
    const shouldRetryMethod = (cfg.method || "GET").toUpperCase() === "GET";
    const isNetwork = !error.response;
    const status = error.response?.status;
    const is5xx = status && status >= 500 && status < 600;
    const isTimeout = error.code === "ECONNABORTED" || /timeout/i.test(error.message || "");
    const transient = isNetwork || is5xx || isTimeout;

    cfg.__retryCount = cfg.__retryCount || 0;
    const maxRetries = 2;

    if (shouldRetryMethod && transient && cfg.__retryCount < maxRetries) {
      cfg.__retryCount += 1;
      const delay = Math.min(1000 * Math.pow(2, cfg.__retryCount), 4000);
      await new Promise((r) => setTimeout(r, delay));
      return api(cfg);
    }

    return Promise.reject(error);
  }
);

// Helper for fetch style usage if needed
export const fetchFromAPI = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    mode: "cors",
    credentials: "omit",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`Request failed ${res.status}: ${url}`);
  return res.json();
};
