import React from "react";
import styled from "styled-components";
import Loading from "./Loading";

function LoadingScreen() {
  return (
    <Wrapper>
      <Loading />
      <Tagline>Loading created by Meeron</Tagline>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Tagline = styled.div`
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #9aa7bf;
`;

export default LoadingScreen;
