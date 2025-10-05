import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";
import Loading from "../components/Loading/Loading";
import { useMalApi } from "../hooks/useMalApi";

function FavouriteAnime() {
  const { page = "1" } = useParams();
  const { items, loading } = useMalApi({
    criteria: "favourite",
    page: Number(page) || 1,
    perPage: 50,
    fallbackKey: "favourite",
  });

  React.useEffect(() => {
    document.title = "Favorite Anime - Animist";
    window.scrollTo(0, 0);
  }, [page]);
  return (
    <div>
      {loading && (
        <>
          <Loading />
          <SearchResultsSkeleton name="Favourite Anime" />
        </>
      )}
      {!loading && (
        <Parent>
          <Heading>
            <span>Favourite Anime</span> Results
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
          <NavButtons>
            {Number(page) > 1 && (
              <NavButton to={`/favourites/${Number(page) - 1}`}>
                Previous
              </NavButton>
            )}
            <NavButton to={`/favourites/${Number(page) + 1}`}>
              Next
            </NavButton>
          </NavButtons>
        </Parent>
      )}
    </div>
  );
}

const NavButtons = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const NavButton = styled(Link)`
  padding: 0.8rem 2rem;
  text-decoration: none;
  color: white;
  background-color: none;
  border: 2px solid #53507a;
  border-radius: 0.5rem;
`;

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

export default FavouriteAnime;
