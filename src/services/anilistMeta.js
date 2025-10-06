import axios from "axios";

const DEFAULT_META_BASE = "https://api.consumet.org/meta/anilist";

// Prefer the user's custom backend if provided, then env override, then public API
const BACKEND_BASE = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "");
const META_ENV = process.env.REACT_APP_META_BASE_URL?.replace(/\/$/, "");
const META_BASE_URL = (
  BACKEND_BASE ? `${BACKEND_BASE}/meta/anilist` : (META_ENV || DEFAULT_META_BASE)
).replace(/\/$/, "");

const DEFAULT_PROVIDER = "gogoanime";

// Known working servers per provider (best-effort)
const SERVERS_BY_PROVIDER = {
  gogoanime: ["vidstreaming", "gogocdn", "streamsb"],
  zoro: ["vidcloud", "streamsb", "vidstreaming"],
};

async function safeGet(url, params = {}, retries = 5, delay = 800) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        params,
        timeout: 20000,
        headers: {
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.warn(`[anilistMeta] request failed (attempt ${i + 1}/${retries})`, url, error?.message || error);
      if (i < retries - 1) {
        const wait = Math.min(5000, delay * Math.pow(2, i));
        await new Promise(resolve => setTimeout(resolve, wait));
      } else {
        return null;
      }
    }
  }
}

export async function fetchMetaInfo(anilistId, { provider = DEFAULT_PROVIDER } = {}) {
  if (!anilistId) return null;
  const url = `${META_BASE_URL}/info/${anilistId}`;
  let data = await safeGet(url, { provider });
  const empty = !data || (typeof data === "object" && Object.keys(data).length === 0);
  if (empty && META_BASE_URL !== DEFAULT_META_BASE) {
    // Fallback to public API base if custom backend failed (e.g., 500/cold start)
    const fallbackUrl = `${DEFAULT_META_BASE}/info/${anilistId}`;
    const alt = await safeGet(fallbackUrl, { provider });
    if (alt) return alt;
  }
  return data;
}

export async function fetchEpisodeSources(
  episodeId,
  { provider = DEFAULT_PROVIDER } = {}
) {
  if (!episodeId) return null;
  const url = `${META_BASE_URL}/watch/${episodeId}`;
  // First try default server (provider default)
  let data = await safeGet(url, { provider });
  const hasSources = Array.isArray(data?.sources) && data.sources.length > 0;
  if (!hasSources && META_BASE_URL !== DEFAULT_META_BASE) {
    // Fallback to public API base if custom backend didn't return sources
    const fallbackUrl = `${DEFAULT_META_BASE}/watch/${episodeId}`;
    const alt = await safeGet(fallbackUrl, { provider });
    if (Array.isArray(alt?.sources) && alt.sources.length > 0) return alt;
  }
  if (!hasSources) {
    // Try specific servers for this provider
    const servers = SERVERS_BY_PROVIDER[provider] || [];
    for (const server of servers) {
      const withServer = await safeGet(url, { provider, server });
      if (Array.isArray(withServer?.sources) && withServer.sources.length > 0) {
        return withServer;
      }
      // also try public base with server
      const fb = await safeGet(`${DEFAULT_META_BASE}/watch/${episodeId}`, { provider, server });
      if (Array.isArray(fb?.sources) && fb.sources.length > 0) {
        return fb;
      }
    }
  }
  return data;
}
