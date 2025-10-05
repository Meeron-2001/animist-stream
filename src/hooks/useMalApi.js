import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LIST_FALLBACKS } from "../data/fallbackData";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";
const PLACEHOLDER_POSTER = "https://i.ibb.co/rv061Rg/showcase.png";

const QUERY_MAP = {
  trending: `query ($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        idMal
        title { romaji english userPreferred }
        bannerImage
        coverImage { large extraLarge }
        popularity
        averageScore
        episodes
      }
    }
  }`,
  airing: `query ($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, status: RELEASING, type: ANIME) {
        id
        idMal
        title { romaji english userPreferred }
        bannerImage
        coverImage { large extraLarge }
        popularity
        averageScore
        episodes
      }
    }
  }`,
  bypopularity: `query ($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        idMal
        title { romaji english userPreferred }
        bannerImage
        coverImage { large extraLarge }
        popularity
        averageScore
        episodes
      }
    }
  }`,
  all: `query ($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        idMal
        title { romaji english userPreferred }
        bannerImage
        coverImage { large extraLarge }
        popularity
        averageScore
        episodes
      }
    }
  }`,
  favourite: `query ($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(sort: FAVOURITES_DESC, type: ANIME) {
        id
        idMal
        title { romaji english userPreferred }
        bannerImage
        coverImage { large extraLarge }
        favourites
        averageScore
        episodes
      }
    }
  }`,
  movie: `query ($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME, format: MOVIE) {
        id
        idMal
        title { romaji english userPreferred }
        bannerImage
        coverImage { large extraLarge }
        popularity
        averageScore
        episodes
      }
    }
  }`,
};

const cloneFallback = (key) =>
  (LIST_FALLBACKS[key] || []).map((item) => ({
    ...item,
    title: { ...item.title },
    coverImage: { ...item.coverImage },
  }));

const normalizeItem = (item) => {
  const fallbackPoster = item.coverImage?.extraLarge || item.coverImage?.large || PLACEHOLDER_POSTER;
  return {
    id: item.idMal || item.id,
    idMal: item.idMal || item.id,
    aniListId: item.id,
    title: {
      english: item.title?.english ?? null,
      romaji: item.title?.romaji ?? null,
      userPreferred: item.title?.userPreferred ?? null,
    },
    bannerImage: item.bannerImage || fallbackPoster,
    coverImage: {
      large: item.coverImage?.large || fallbackPoster,
      extraLarge: item.coverImage?.extraLarge || fallbackPoster,
    },
    popularity: item.popularity ?? item.favourites ?? null,
    averageScore: item.averageScore ?? null,
    episodes: item.episodes ?? null,
  };
};

export function useMalApi({ criteria, page = 1, perPage = 15, fallbackKey }) {
  const [items, setItems] = useState(() => cloneFallback(fallbackKey));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const query = QUERY_MAP[criteria];
    if (!query) {
      console.warn(`[useMalApi] Unsupported criteria "${criteria}". Falling back.`);
      setItems(cloneFallback(fallbackKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        ANILIST_ENDPOINT,
        {
          query,
          variables: { page: Number(page) || 1, perPage: Number(perPage) || 15 },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      const media = response.data?.data?.Page?.media;
      if (!Array.isArray(media) || media.length === 0) {
        console.warn("[useMalApi] AniList returned no media, using fallback data.");
        setItems(cloneFallback(fallbackKey));
        setLoading(false);
        return;
      }

      const normalized = media
        .map(normalizeItem)
        .filter((item) => item.id);

      if (!normalized.length) {
        setItems(cloneFallback(fallbackKey));
      } else {
        setItems(normalized);
      }
    } catch (err) {
      console.warn("[useMalApi] Failed to load AniList data:", err);
      setError(err);
      setItems(cloneFallback(fallbackKey));
    } finally {
      setLoading(false);
    }
  }, [criteria, fallbackKey, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  return useMemo(
    () => ({
      items,
      loading,
      error,
      reload: load,
    }),
    [error, items, load, loading]
  );
}
