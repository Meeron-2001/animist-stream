import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import Nav from "./components/Navigation/Nav";
import LoadingScreen from "./components/Loading/LoadingScreen";
import GlobalStyle from "./styles/globalStyles";
import Footer from "./components/Footer/Footer";

const Home = lazy(() => import("./pages/Home"));
const AnimeDetails = lazy(() => import("./pages/AnimeDetails"));
const FavouriteAnime = lazy(() => import("./pages/FavouriteAnime"));
const MalAnimeDetails = lazy(() => import("./pages/MalAnimeDetails"));
const PopularAnime = lazy(() => import("./pages/PopularAnime"));
const PopularMovies = lazy(() => import("./pages/PopularMovies"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Top100Anime = lazy(() => import("./pages/Top100Anime"));
const TrendingAnime = lazy(() => import("./pages/TrendingAnime"));
const WatchAnime = lazy(() => import("./pages/WatchAnime"));
const WatchAnimeV2 = lazy(() => import("./pages/WatchAnimeV2"));

function AppContainer() {
  const location = useLocation();
  const path = location.pathname || "";
  const hideFooter = path.startsWith("/watch") || path.startsWith("/play");

  return (
    <>
      <GlobalStyle />
      <Layout>
        <Nav />
        <Main>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/popular/:page" element={<PopularAnime />} />
              <Route path="/trending/:page" element={<TrendingAnime />} />
              <Route path="/favourites/:page" element={<FavouriteAnime />} />
              <Route path="/top100/:page" element={<Top100Anime />} />
              <Route path="/movies" element={<PopularMovies />} />
              <Route path="/search/:name" element={<SearchResults />} />
              <Route path="/category/:slug" element={<AnimeDetails />} />
              <Route path="/watch/:episode" element={<WatchAnime />} />
              <Route path="/id/:id" element={<MalAnimeDetails />} />
              <Route path="/play/:id/:slug/:episode" element={<WatchAnimeV2 />} />
            </Routes>
          </Suspense>
        </Main>
        {!hideFooter && <Footer />}
        <Toaster
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#242235",
              border: "1px solid #393653",
              color: "#fff",
            },
          }}
        />
      </Layout>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

export default App;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1 0 auto;
`;
