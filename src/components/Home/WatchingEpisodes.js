import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../skeletons/AnimeCardsSkeleton";
import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons";
import { searchWatchedId } from "../../hooks/searchQueryStrings";
import Loading from "../Loading/Loading";

import "swiper/css";
import "swiper/css/scrollbar";

function WatchingEpisodes() {
  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);

  const getAnimeData = useCallback(async () => {
    setLoading(true);
    const stored = localStorage.getItem("Watching");
    if (!stored) {
      setLocalData([]);
      setData([]);
      setLoading(false);
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch (err) {
      console.error("Failed to parse Watching from localStorage", err);
      setLocalData([]);
      setData([]);
      setLoading(false);
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setLocalData([]);
      setData([]);
      setLoading(false);
      return;
    }
    setLocalData(parsed);
    const ids = parsed
      .map((entry) => entry?.malId)
      .filter((id) => typeof id === "number" || typeof id === "string");
    if (ids.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }
    const result = await axios({
      url: process.env.REACT_APP_BASE_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        query: searchWatchedId,
        variables: {
          ids,
        },
      },
    }).catch((err) => {
      console.error(err);
      return null;
    });
    const media = result?.data?.data?.Page?.media;
    if (!Array.isArray(media)) {
      setData([]);
      setLoading(false);
      return;
    }
    const output = parsed
      .map((entry) => {
        const match = media.find(
          (item) => parseInt(item?.idMal, 10) === parseInt(entry?.malId, 10)
        );
        return match || null;
      })
      .filter(Boolean);
    setData(output);
    setLoading(false);
  }, []);

  useEffect(() => {
    getAnimeData();
  }, [getAnimeData]);

  function removeAnime(index) {
    const stored = localStorage.getItem("Watching");
    if (!stored) {
      return;
    }
    let lsData;
    try {
      lsData = JSON.parse(stored);
    } catch (err) {
      console.error("Failed to parse Watching from localStorage", err);
      return;
    }
    if (!Array.isArray(lsData)) {
      return;
    }
    lsData.splice(index, 1);
    setLocalData(lsData);
    localStorage.setItem("Watching", JSON.stringify(lsData));
    setData((prev) => prev.filter((_, i) => i !== index));
    setChange(!change);
  }

  return (
    <div>
      {loading && (
        <>
          <Loading />
          <AnimeCardsSkeleton />
        </>
      )}
      {!loading && (
        <Swiper
          slidesPerView={7}
          spaceBetween={35}
          scrollbar={{
            hide: false,
          }}
          breakpoints={{
            "@0.00": {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            "@0.75": {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            "@1.00": {
              slidesPerView: 4,
              spaceBetween: 35,
            },
            "@1.30": {
              slidesPerView: 5,
              spaceBetween: 35,
            },
            "@1.50": {
              slidesPerView: 7,
              spaceBetween: 35,
            },
          }}
          modules={[Scrollbar]}
          className="mySwiper"
        >
          {data.map((item, i) => (
            <SwiperSlide>
              <Wrapper>
                <IconContext.Provider
                  value={{
                    size: "1.2rem",
                    color: "white",
                    style: {
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <button
                    className="closeButton"
                    onClick={() => {
                      removeAnime(i);
                    }}
                  >
                    <IoClose />
                  </button>
                </IconContext.Provider>

                <Link
                  to={`play/${localData[i].malId}/${localData[i].animeId}/${localData[i].episode}`}
                >
                  <img src={item.coverImage.extraLarge} alt="" />
                </Link>
                <p>
                  {item.title.english !== null
                    ? item.title.english
                    : item.title.userPreferred}
                  {localData[i].isDub ? " (Dub)" : " (Sub)"}
                </p>
                <p className="episodeNumber">
                  {"Episode - " + localData[i].episode}
                </p>
              </Wrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

const Wrapper = styled.div`
  position: relative;

  .closeButton {
    position: absolute;
    cursor: pointer;
    outline: none;
    border: none;
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0.5rem 0 0.2rem 0;
  }
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.5rem;
    margin-bottom: 0.3rem;
    object-fit: cover;
    @media screen and (max-width: 600px) {
      width: 120px;
      height: 180px;
    }
    @media screen and (max-width: 400px) {
      width: 100px;
      height: 160px;
    }
  }

  p {
    color: white;
    font-size: 1rem;
    font-weight: 400;
    @media screen and (max-width: 600px) {
      max-width: 120px;
    }
    @media screen and (max-width: 400px) {
      max-width: 100px;
    }
  }

  .episodeNumber {
    font-size: 0.9rem;
    font-weight: 300;
    color: #b5c3de;
  }
`;

export default WatchingEpisodes;
