const PLACEHOLDER_BANNER = "https://cdn.wallpapersafari.com/41/44/6Q9Nwh.jpg";

const createFallbackItem = ({
  id,
  aniListId,
  title,
  bannerImage,
  cover,
  popularity,
  averageScore,
  episodes,
}) => ({
  id,
  idMal: id,
  aniListId,
  title: {
    english: title.english || null,
    romaji: title.romaji || title.english || null,
    userPreferred: title.userPreferred || title.english || title.romaji || null,
  },
  bannerImage: bannerImage || PLACEHOLDER_BANNER,
  coverImage: {
    large: cover.large,
    extraLarge: cover.extraLarge || cover.large,
  },
  popularity: popularity ?? null,
  averageScore: averageScore ?? null,
  favourites: null,
  episodes: episodes ?? null,
  poster: cover.extraLarge || cover.large,
});

export const LIST_FALLBACKS = {
  trending: [
    createFallbackItem({
      id: 5114,
      aniListId: 5114,
      title: {
        english: "Fullmetal Alchemist: Brotherhood",
        romaji: "Hagane no Renkinjutsushi: Fullmetal Alchemist",
        userPreferred: "Fullmetal Alchemist: Brotherhood",
      },
      bannerImage:
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/medium/b5114-3K02BC5T9Lm4.jpg",
      cover: {
        large:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-044XJcY0Ppx2.jpg",
        extraLarge:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-044XJcY0Ppx2.jpg",
      },
      popularity: 200000,
      averageScore: 90,
      episodes: 64,
    }),
    createFallbackItem({
      id: 11061,
      aniListId: 11061,
      title: {
        english: "Hunter x Hunter",
        romaji: "Hunter x Hunter (2011)",
        userPreferred: "Hunter x Hunter (2011)",
      },
      bannerImage:
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/large/bx11061-T0G8Ww2tngwF.jpg",
      cover: {
        large:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11061-FC3i0kk9fFiA.png",
        extraLarge:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-FC3i0kk9fFiA.png",
      },
      popularity: 195000,
      averageScore: 91,
      episodes: 148,
    }),
  ],
  popular: [
    createFallbackItem({
      id: 20,
      aniListId: 20,
      title: {
        english: "Naruto",
        romaji: "Naruto",
        userPreferred: "Naruto",
      },
      bannerImage:
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/large/bx20-qX18lGEXLFeW.jpg",
      cover: {
        large:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20-YJvZ0pBrxG45.png",
        extraLarge:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-YJvZ0pBrxG45.png",
      },
      popularity: 250000,
      averageScore: 79,
      episodes: 220,
    }),
  ],
  top100: [
    createFallbackItem({
      id: 1,
      aniListId: 1,
      title: {
        english: "Cowboy Bebop",
        romaji: "Cowboy Bebop",
        userPreferred: "Cowboy Bebop",
      },
      bannerImage:
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/medium/b1-1X7W0dNwCrEq.jpg",
      cover: {
        large:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1-v4bZr4rRbQCe.jpg",
        extraLarge:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-v4bZr4rRbQCe.jpg",
      },
      popularity: 150000,
      averageScore: 88,
      episodes: 26,
    }),
  ],
  favourite: [
    createFallbackItem({
      id: 16498,
      aniListId: 16498,
      title: {
        english: "Attack on Titan",
        romaji: "Shingeki no Kyojin",
        userPreferred: "Attack on Titan",
      },
      bannerImage:
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/large/bx16498-ZhZkEg6MqxsK.jpg",
      cover: {
        large:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-WPp7arbMP7CP.png",
        extraLarge:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-WPp7arbMP7CP.png",
      },
      popularity: 210000,
      averageScore: 85,
      episodes: 25,
    }),
  ],
  movie: [
    createFallbackItem({
      id: 2236,
      aniListId: 2236,
      title: {
        english: "The Girl Who Leapt Through Time",
        romaji: "Toki wo Kakeru Shoujo",
        userPreferred: "The Girl Who Leapt Through Time",
      },
      bannerImage:
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/large/bx2236-hlLyC9+dIFE1.jpg",
      cover: {
        large:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2236-s5KfuzMdGz3O.png",
        extraLarge:
          "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx2236-s5KfuzMdGz3O.png",
      },
      popularity: 80000,
      averageScore: 82,
      episodes: 1,
    }),
  ],
};
