import React from "react";
import styled, { keyframes } from "styled-components";

// A simple glowing orb spinner (CSS only)
function Loading() {
  return (
    <Wrapper>
      <Spinner>
        <div className="core" />
        <div className="ring" />
      </Spinner>
      <Label>Loading...</Label>
    </Wrapper>
  );
}

const pulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(118,118,255,0.4), 0 0 20px rgba(118,118,255,0.2); }
  50% { box-shadow: 0 0 20px rgba(118,118,255,0.9), 0 0 40px rgba(118,118,255,0.6); }
  100% { box-shadow: 0 0 10px rgba(118,118,255,0.4), 0 0 20px rgba(118,118,255,0.2); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const Spinner = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 0.75rem;
  .core {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(closest-side, #7676ff 30%, #4f4ddb 60%, rgba(118,118,255,0.15));
    animation: ${pulse} 1.6s ease-in-out infinite;
  }
  .ring {
    position: absolute;
    inset: -6px;
    border: 3px solid rgba(118,118,255,0.25);
    border-top-color: #7676ff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const Label = styled.div`
  color: #b5c3de;
  font-size: 0.95rem;
  font-weight: 400;
`;

export default Loading;
