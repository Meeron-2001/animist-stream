import { api } from "../../lib/api";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import AnimeCardsSkeleton from "../../components/skeletons/AnimeCardsSkeleton";
import Loading from "../Loading/Loading";

import "swiper/css";
import "swiper/css/scrollbar";

function AnimeCards(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/getmalinfo?criteria=${props.criteria}&count=${props.count}`
      );
      if (Array.isArray(res?.data?.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [props.criteria, props.count]);

  useEffect(() => {
    getData();
  }, [getData]);
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
            <SwiperSlide key={item?.node?.id || i}>
              <Wrapper>
                <Link to={`/id/${item?.node?.id}`}>
                  <img
                    src={item?.node?.main_picture?.large || item?.node?.main_picture?.medium || "https://i.ibb.co/rv061Rg/showcase.png"}
                    alt={item?.node?.title || "Anime poster"}
                  />
                </Link>
                <p>{item?.node?.title || "Unknown Title"}</p>
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
