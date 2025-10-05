import axios from "axios";

const DEFAULT_META_BASE = "https://api.consumet.org/meta/anilist";

// Prefer the user's custom backend if provided, then env override, then public API
const BACKEND_BASE = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "");
const META_ENV = process.env.REACT_APP_META_BASE_URL?.replace(/\/$/, "");
const META_BASE_URL = (
  BACKEND_BASE ? `${BACKEND_BASE}/meta/anilist` : (META_ENV || DEFAULT_META_BASE)
).replace(/\/$/, "");

const DEFAULT_PROVIDER = "gogoanime";

async function safeGet(url, params = {}, retries = 3, delay = 1000) {
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
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        return null;
      }
    }
  }
}

export async function fetchMetaInfo(anilistId, { provider = DEFAULT_PROVIDER } = {}) {
  if (!anilistId) return null;
  const url = `${META_BASE_URL}/info/${anilistId}`;
  return safeGet(url, { provider });
}

export async function fetchEpisodeSources(
  episodeId,
  { provider = DEFAULT_PROVIDER } = {}
) {
  if (!episodeId) return null;
  const url = `${META_BASE_URL}/watch/${episodeId}`;
  return safeGet(url, { provider });
}
