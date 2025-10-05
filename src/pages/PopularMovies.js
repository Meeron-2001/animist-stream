import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";
import Loading from "../components/Loading/Loading";
import { useMalApi } from "../hooks/useMalApi";

function PopularMovies() {
  const { items, loading } = useMalApi({
    criteria: "movie",
    page: 1,
    perPage: 100,
    fallbackKey: "movie",
  });

  React.useEffect(() => {
    document.title = "Popular Movies - Animist";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {loading && (
        <>
          <Loading />
          <SearchResultsSkeleton name="Popular Movie" />
        </>
      )}
      {!loading && (
        <Parent>
          <Heading>
            <span>Popular Movie</span> Results
          </Heading>
          <CardWrapper>
            {items.map((item) => (
              <Links key={item.id} to={`/id/${item.id}`}>
                <img
                  src={item.coverImage.large}
                  alt={item.title.english || item.title.userPreferred || "Anime Poster"}
                />
                <p>{item.title.english || item.title.userPreferred || "Unknown Title"}</p>
              </Links>
            ))}
          </CardWrapper>
        </Parent>
      )}
    </div>
  );
}
const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 1rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 380px) {
    grid-template-columns: repeat(auto-fill, 100px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }
`;

const Links = styled(Link)`
  text-decoration: none;
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.5rem;
    object-fit: cover;
    @media screen and (max-width: 600px) {
      width: 120px;
      height: 180px;
      border-radius: 0.3rem;
    }
    @media screen and (max-width: 400px) {
      width: 110px;
      height: 170px;
    }
    @media screen and (max-width: 380px) {
      width: 100px;
      height: 160px;
    }
  }

  p {
    color: white;
    font-size: 1rem;
    font-weight: 400;
    text-decoration: none;
    max-width: 160px;
    @media screen and (max-width: 380px) {
      width: 100px;
      font-size: 0.9rem;
    }
  }
`;

const Heading = styled.p`
  font-size: 1.8rem;
  color: white;
  font-weight: 200;
  margin-bottom: 2rem;
  span {
    font-weight: 600;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;
export default PopularMovies;
