import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../components/Home/Carousel";
import AnimeCards from "../components/Home/AnimeCards";
import HomeSkeleton from "../components/skeletons/CarouselSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import WatchingEpisodes from "../components/Home/WatchingEpisodes";
import Loading from "../components/Loading/Loading";
import { useMalApi } from "../hooks/useMalApi";

function Home() {
  const { width } = useWindowDimensions();
  const [hasWatching, setHasWatching] = useState(false);

  const { items: heroItems, loading: heroLoading } = useMalApi({
    criteria: "bypopularity",
    page: 1,
    perPage: 10,
    fallbackKey: "popular",
  });

  useEffect(() => {
    document.title = "Animist - Watch Anime Free Online With English Sub and Dub";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("Watching");
      if (!stored) {
        setHasWatching(false);
        return;
      }
      const parsed = JSON.parse(stored);
      setHasWatching(Array.isArray(parsed) && parsed.length > 0);
    } catch (err) {
      console.warn("[Home] Failed to parse Watching from localStorage", err);
      setHasWatching(false);
    }
  }, []);

  const carouselImages = useMemo(() => heroItems.slice(0, 5), [heroItems]);
  return (
    <div>
      <HomeDiv>
        <HomeHeading>
          <span>Recommended</span> to you
        </HomeHeading>
        {heroLoading && (
          <>
            <Loading />
            <HomeSkeleton />
          </>
        )}
        {!heroLoading && <Carousel images={carouselImages} />}
        {hasWatching && (
          <div>
            <HeadingWrapper>
              <Heading>
                <span>Continue</span> Watching
              </Heading>
            </HeadingWrapper>
            <WatchingEpisodes />
          </div>
        )}
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Trending</span> Now
            </Heading>
            <Links to="/trending/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards
            count={width <= 600 ? 7 : 15}
            criteria="trending"
            fallbackKey="trending"
          />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Top</span> Airing
            </Heading>
            <Links to="/airing/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards
            count={width <= 600 ? 7 : 15}
            criteria="airing"
            fallbackKey="trending"
          />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>All Time</span> Popular
            </Heading>
            <Links to="/popular/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards
            count={width <= 600 ? 7 : 15}
            criteria="bypopularity"
            fallbackKey="popular"
          />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Top 100</span> Anime
            </Heading>
            <Links to="/top100/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards
            count={width <= 600 ? 7 : 15}
            criteria="all"
            fallbackKey="top100"
          />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>All Time</span> Favourite
            </Heading>
            <Links to="/favourites/1">View All</Links>
          </HeadingWrapper>
          <AnimeCards
            count={width <= 600 ? 7 : 15}
            criteria="favourite"
            fallbackKey="favourite"
          />
        </div>
        <div>
          <HeadingWrapper>
            <Heading>
              <span>Popular</span> Movies
            </Heading>
            <Links to="/movies">View All</Links>
          </HeadingWrapper>
          <AnimeCards
            count={width <= 600 ? 7 : 15}
            criteria="movie"
            fallbackKey="movie"
          />
        </div>
      </HomeDiv>
    </div>
  );
}

const Links = styled(Link)`
  color: white;
  font-size: 1.1rem;
  font-family: "Gilroy-Medium", sans-serif;
  @media screen and (max-width: 600px) {
    color: white;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
  }
`;

const HomeDiv = styled.div`
  margin: 1.5rem 5rem 1rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem 1rem 0rem 1rem;
  }
`;

const HomeHeading = styled.p`
  font-size: 2.3rem;
  color: white;
  font-weight: 200;

  span {
    font-weight: 600;
  }
  margin-bottom: 1rem;

  @media screen and (max-width: 600px) {
    font-size: 1.7rem;
  }
`;

const Heading = styled.p`
  font-size: 1.8rem;
  color: white;
  font-weight: 200;
  margin-top: 1rem;
  span {
    font-weight: 600;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  @media screen and (max-width: 600px) {
    margin-top: 1rem;
  }
`;

export default Home;
