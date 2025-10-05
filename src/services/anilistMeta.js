import axios from "axios";

const DEFAULT_META_BASE = "https://api.consumet.org/meta/anilist";

const META_BASE_URL =
  process.env.REACT_APP_META_BASE_URL?.replace(/\/$/, "") || DEFAULT_META_BASE;

const DEFAULT_PROVIDER = "gogoanime";

async function safeGet(url, params = {}) {
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
    console.warn("[anilistMeta] request failed", url, error?.message || error);
    return null;
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
