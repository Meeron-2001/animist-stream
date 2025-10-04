import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <Wrapper>
      <small>Created by Meeron</small>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  margin: 2rem 0;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aa7bf;
  font-size: 0.85rem;
  border-top: 1px solid #2a2940;
  width: 100%;
  flex-shrink: 0;
`;

export default Footer;
