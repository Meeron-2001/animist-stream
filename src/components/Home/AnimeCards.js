import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../../components/skeletons/AnimeCardsSkeleton";
import Loading from "../Loading/Loading";
import { useMalApi } from "../../hooks/useMalApi";

import "swiper/css";
import "swiper/css/scrollbar";

function AnimeCards({ criteria, count = 15, fallbackKey }) {
  const { items, loading } = useMalApi({
    criteria,
    page: 1,
    perPage: count,
    fallbackKey,
  });
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
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <Wrapper>
                <Link to={`/id/${item.id}`}>
                  <img
                    src={item.coverImage.extraLarge || item.coverImage.large}
                    alt={item.title.userPreferred || item.title.english || "Anime"}
                    onError={(e) => {
                      e.currentTarget.src = "https://i.ibb.co/rv061Rg/showcase.png";
                    }}
                  />
                </Link>
                <p>{item.title.english || item.title.userPreferred || "Unknown Title"}</p>
              </Wrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

const Wrapper = styled.div`
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
  }
`;

export default AnimeCards;
