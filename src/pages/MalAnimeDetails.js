import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import AnimeDetailsSkeleton from "../components/skeletons/AnimeDetailsSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { searchByIdQuery } from "../hooks/searchQueryStrings";
import Loading from "../components/Loading/Loading";
import { fetchMetaInfo } from "../services/anilistMeta";

function MalAnimeDetails() {
  let id = useParams().id;

  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [anilistResponse, setAnilistResponse] = useState();
  const [playbackData, setPlaybackData] = useState(null);
  const [selectedType, setSelectedType] = useState("sub");
  const [expanded, setExpanded] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

  const getInfo = useCallback(async () => {
    if (id === "null") {
      setNotAvailable(true);
      return;
    }
    const aniRes = await axios({
      url: process.env.REACT_APP_BASE_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        query: searchByIdQuery,
        variables: {
          id: Number(id),
        },
      },
    }).catch((err) => {
      console.error(err);
      return null;
    });
    if (!aniRes || !aniRes.data?.data?.Media) {
      setNotAvailable(true);
      setLoading(false);
      return;
    }
    const media = aniRes.data.data.Media;
    setAnilistResponse(media);

    console.log("Fetching meta info for Anilist ID:", media.id);
    const meta = await fetchMetaInfo(media.id);
    console.log("Meta response:", meta);

    const normalizeEpisodes = (episodes = []) => {
      if (!Array.isArray(episodes)) return [];
      return [...episodes].sort((a, b) => {
        const getNum = (ep) => {
          if (ep?.number !== undefined && ep?.number !== null) {
            return Number(ep.number);
          }
          if (ep?.episode !== undefined && ep?.episode !== null) {
            return Number(ep.episode);
          }
          const match = typeof ep.title === "string" ? ep.title.match(/\d+/) : null;
          return match ? Number(match[0]) : null;
        };
        return getNum(a) - getNum(b);
      });
    };

    // Try primary provider first, then fallback to an alternate provider if empty
    let metaData = meta;
    const metaEmpty =
      !metaData ||
      ((!(Array.isArray(metaData?.episodes)) || metaData.episodes.length === 0) &&
        (!(Array.isArray(metaData?.episodesDub)) || metaData.episodesDub.length === 0));
    if (metaEmpty) {
      console.log("[Meta] gogoanime returned empty. Trying fallback provider: zoro");
      const fallback = await fetchMetaInfo(media.id, { provider: "zoro" });
      if (fallback) metaData = fallback;
      console.log("[Meta] zoro response:", metaData);
    }

    let subEpisodes = normalizeEpisodes(metaData?.episodes);
    let dubEpisodes = normalizeEpisodes(metaData?.episodesDub);

    // Final fallback: use AniList's streamingEpisodes as external links
    if (
      subEpisodes.length === 0 &&
      dubEpisodes.length === 0 &&
      Array.isArray(media.streamingEpisodes) &&
      media.streamingEpisodes.length > 0
    ) {
      console.log("[Meta] Falling back to AniList.streamingEpisodes external links");
      subEpisodes = media.streamingEpisodes.map((ep, i) => {
        const match = typeof ep.title === "string" ? ep.title.match(/\d+/) : null;
        return {
          title: ep.title || `Episode ${i + 1}`,
          url: ep.url,
          number: match ? Number(match[0]) : i + 1,
        };
      });
    }
    const hasSub = subEpisodes.length > 0;
    const hasDub = dubEpisodes.length > 0;

    const deriveBaseSlug = (episodes = []) => {
      const firstId = episodes?.[0]?.id;
      if (!firstId || typeof firstId !== "string") return null;
      const splitIndex = firstId.indexOf("-episode-");
      if (splitIndex === -1) return firstId;
      return firstId.substring(0, splitIndex);
    };

    const subSlug = deriveBaseSlug(subEpisodes);
    const dubSlug = deriveBaseSlug(dubEpisodes);

    setPlaybackData({
      hasSub,
      hasDub,
      subEpisodes,
      dubEpisodes,
      subSlug,
      dubSlug,
    });
    setSelectedType(hasSub ? "sub" : hasDub ? "dub" : "sub");
    setLoading(false);
    if (aniRes?.data?.data?.Media?.title?.userPreferred) {
      document.title = `${aniRes.data.data.Media.title.userPreferred} - Animist`;
    }
  }, [id]);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  useEffect(() => {
    if (!playbackData) return;
    if (selectedType === "sub" && !playbackData.hasSub && playbackData.hasDub) {
      setSelectedType("dub");
    }
    if (selectedType === "dub" && !playbackData.hasDub && playbackData.hasSub) {
      setSelectedType("sub");
    }
  }, [playbackData, selectedType]);

  const getEpisodeNumber = useCallback((episode) => {
    if (!episode) return null;
    if (episode.number !== undefined && episode.number !== null) {
      return Number(episode.number);
    }
    if (episode.episode !== undefined && episode.episode !== null) {
      return Number(episode.episode);
    }
    const match = typeof episode.title === "string" ? episode.title.match(/\d+/) : null;
    return match ? Number(match[0]) : null;
  }, []);

  const activeEpisodes = useMemo(() => {
    if (!playbackData) return [];
    if (selectedType === "dub" && playbackData.hasDub) return playbackData.dubEpisodes;
    if (selectedType === "sub" && playbackData.hasSub) return playbackData.subEpisodes;
    if (playbackData.hasSub) return playbackData.subEpisodes;
    if (playbackData.hasDub) return playbackData.dubEpisodes;
    return [];
  }, [playbackData, selectedType]);

  const activeSlug = useMemo(() => {
    if (!playbackData) return null;
    if (selectedType === "dub" && playbackData.dubSlug) return playbackData.dubSlug;
    if (selectedType === "sub" && playbackData.subSlug) return playbackData.subSlug;
    return playbackData.subSlug || playbackData.dubSlug || null;
  }, [playbackData, selectedType]);

  const firstEpisodeNumber = activeEpisodes.length
    ? getEpisodeNumber(activeEpisodes[0]) || 1
    : null;

  const watchLink = activeSlug && firstEpisodeNumber
    ? `/play/${id}/${activeSlug}/${firstEpisodeNumber}`
    : null;

  const fallbackExternal = !watchLink && activeEpisodes.length
    ? activeEpisodes[0]?.url || null
    : null;

  const hasEpisodes = activeEpisodes.length > 0;
  const showToggle = Boolean(playbackData?.hasSub && playbackData?.hasDub);
  const canPlayInternally = Boolean(activeSlug);

  function readMoreHandler() {
    setExpanded(!expanded);
  }


  return (
    <div>
      {notAvailable && (
        <NotAvailable>
          <img src="./assets/404.png" alt="404" />
          <h1>Oops! This Anime Is Not Available</h1>
        </NotAvailable>
      )}
      {loading && !notAvailable && (
        <>
          <Loading />
          <AnimeDetailsSkeleton />
        </>
      )}
      {!loading && !notAvailable && (
        <div style={{ margin: width <= 600 ? '1rem' : '2rem 5rem', position: 'relative' }}>
          {anilistResponse !== undefined && (
            <div>
              <Banner
                src={
                  anilistResponse.bannerImage !== null
                    ? anilistResponse.bannerImage
                    : "https://cdn.wallpapersafari.com/41/44/6Q9Nwh.jpg"
                }
                alt=""
              />
              <ContentWrapper>
                <Poster>
                  <img src={anilistResponse.coverImage.extraLarge} alt="" />
                  {watchLink && (
                    <Button to={watchLink}>
                      Watch {selectedType === "dub" ? "Dub" : "Sub"}
                    </Button>
                  )}
                  {!watchLink && fallbackExternal && (
                    <Button
                      as="a"
                      href={fallbackExternal}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch {selectedType === "dub" ? "Dub" : "Sub"}
                    </Button>
                  )}
                </Poster>
                <div>
                  <h1>{anilistResponse.title.userPreferred}</h1>
                  {anilistResponse.title.english != null && (
                    <h3>{"English - " + anilistResponse.title.english}</h3>
                  )}
                  <p>
                    <span>Type: </span>
                    {anilistResponse.type}
                  </p>
                  {width <= 600 && expanded && (
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: `<span>Plot Summery: </span>${anilistResponse.description}`,
                        }}
                      ></p>
                      <button onClick={() => readMoreHandler()}>
                        read less
                      </button>
                    </section>
                  )}

                  {width <= 600 && !expanded && (
                    <p>
                      <span>Plot Summery: </span>
                      {anilistResponse.description.substring(0, 200) + "... "}
                      <button onClick={() => readMoreHandler()}>
                        read more
                      </button>
                    </p>
                  )}
                  {width > 600 && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          "<span>Plot Summery: </span>" +
                          anilistResponse.description,
                      }}
                    ></p>
                  )}

                  <p>
                    <span>Genre: </span>
                    {anilistResponse.genres.toString()}
                  </p>
                  <p>
                    <span>Released: </span>
                    {anilistResponse.startDate.year}
                  </p>
                  <p>
                    <span>Status: </span>
                    {anilistResponse.status}
                  </p>
                  {anilistResponse.episodes && (
                    <p>
                      <span>Total Episodes: </span>
                      {anilistResponse.episodes}
                    </p>
                  )}
                </div>
              </ContentWrapper>
              <Episode>
                <DubContainer>
                  <h2>Episodes</h2>
                  {showToggle && (
                    <ToggleGroup>
                      <ToggleButton
                        type="button"
                        className={selectedType === "sub" ? "active" : ""}
                        onClick={() => setSelectedType("sub")}
                        disabled={!playbackData?.hasSub}
                      >
                        Sub
                      </ToggleButton>
                      <ToggleButton
                        type="button"
                        className={selectedType === "dub" ? "active" : ""}
                        onClick={() => setSelectedType("dub")}
                        disabled={!playbackData?.hasDub}
                      >
                        Dub
                      </ToggleButton>
                    </ToggleGroup>
                  )}
                  {!hasEpisodes && <p>No streaming episodes available.</p>}
                </DubContainer>
                {hasEpisodes && (
                  <Episodes>
                    {activeEpisodes.map((episode, index) => {
                      const episodeNumber = getEpisodeNumber(episode) || index + 1;
                      const key = episode?.id || `${selectedType}-${episodeNumber}`;

                      if (canPlayInternally) {
                        return (
                          <EpisodeLink
                            key={key}
                            to={`/play/${id}/${activeSlug}/${episodeNumber}`}
                          >
                            Episode {episodeNumber}
                          </EpisodeLink>
                        );
                      }

                      const externalHref = episode?.url || "#";
                      return (
                        <EpisodeExternal
                          key={key}
                          href={externalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Episode {episodeNumber}
                        </EpisodeExternal>
                      );
                    })}
                  </Episodes>
                )}
              </Episode>
            </div>
          )}
                </div>
      )}
    </div>
  );
}

const NotAvailable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
  img {
    width: 30rem;
  }

  h1 {
    margin-top: -2rem;
    font-weight: normal;
    font-weight: 600;
  }

  @media screen and (max-width: 600px) {
    img {
      width: 18rem;
    }

    h1 {
      font-size: 1.3rem;
    }
  }
`;

const DubContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;

  .switch {
    position: relative;

    label {
      display: flex;
      align-items: center;
      font-family: "Lexend", sans-serif;
      font-weight: 400;
      cursor: pointer;
      margin-bottom: 0.3rem;
    }

    .label {
      margin-bottom: 0.7rem;
      font-weight: 500;
    }

    .indicator {
      position: relative;
      width: 60px;
      height: 30px;
      background: #242235;
      border: 2px solid #393653;
      display: block;
      border-radius: 30px;
      margin-right: 10px;
      margin-bottom: 10px;

      &:before {
        width: 22px;
        height: 22px;
        content: "";
        display: block;
        background: #7676ff;
        border-radius: 26px;
        transform: translate(2px, 2px);
        position: relative;
        z-index: 2;
        transition: all 0.5s;
      }
    }
    input {
      visibility: hidden;
      position: absolute;

      &:checked {
        & + .indicator {
          &:before {
            transform: translate(32px, 2px);
          }
          &:after {
            width: 54px;
          }
        }
      }
    }
  }
`;

const Episode = styled.div`
  margin: 0 4rem 0 4rem;
  padding: 2rem;
  outline: 2px solid #272639;
  border-radius: 0.5rem;
  color: white;

  h2 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  box-shadow: 0px 4.41109px 20.291px rgba(16, 16, 24, 0.81);

  @media screen and (max-width: 600px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

const Episodes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 1rem;
  grid-row-gap: 1rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  }
`;

const EpisodeLink = styled(Link)`
  text-align: center;
  color: white;
  text-decoration: none;
  background-color: #242235;
  padding: 0.9rem 2rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid #393653;
  transition: 0.2s;

  :hover {
    background-color: #7676ff;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
    border-radius: 0.3rem;
    font-weight: 500;
  }
`;

const EpisodeExternal = styled.a`
  text-align: center;
  color: white;
  text-decoration: none;
  background-color: #242235;
  padding: 0.9rem 2rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid #393653;
  transition: 0.2s;

  :hover {
    background-color: #7676ff;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
    border-radius: 0.3rem;
    font-weight: 500;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 0.4rem;
  border: 1px solid #393653;
  background-color: #242235;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;

  &.active {
    background-color: #7676ff;
    border-color: #7676ff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 3rem 0 3rem;
  display: flex;

  div > * {
    margin-bottom: 0.6rem;
  }

  div {
    margin: 1rem;
    font-size: 1rem;
    color: #b5c3de;
    span {
      font-weight: 700;
      color: white;
    }
    p {
      font-weight: 300;
      text-align: justify;
    }
    h1 {
      font-weight: 700;
      color: white;
    }
    h3 {
      font-weight: 500;
    }
    button {
      display: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column-reverse;
    padding: 0;
    div {
      margin: 1rem;
      margin-bottom: 0.2rem;
      h1 {
        font-size: 1.6rem;
      }
      p {
        font-size: 1rem;
      }
      button {
        display: inline;
        border: none;
        outline: none;
        background-color: transparent;
        text-decoration: underline;
        font-weight: 700;
        font-size: 1rem;
        color: white;
      }
    }
  }
`;

const Poster = styled.div`
  display: flex;
  flex-direction: column;
  img {
    width: 220px;
    height: 300px;
    border-radius: 0.5rem;
    margin-bottom: 2.3rem;
    position: relative;
    top: -20%;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  }
  @media screen and (max-width: 600px) {
    img {
      display: none;
    }
  }

  .outline {
    background-color: transparent;
    border: 2px solid #9792cf;
  }
`;

const Button = styled(Link)`
  font-size: 1.2rem;
  padding: 1rem 3.4rem;
  text-align: center;
  text-decoration: none;
  color: white;
  background-color: #7676ff;
  font-weight: 700;
  border-radius: 0.4rem;
  position: relative;
  top: -25%;
  white-space: nowrap;

  @media screen and (max-width: 600px) {
    display: block;
    width: 100%;
  }
`;

const Banner = styled.img`
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.7rem;

  @media screen and (max-width: 600px) {
    height: 13rem;
    border-radius: 0.5rem;
  }
`;

export default MalAnimeDetails;
