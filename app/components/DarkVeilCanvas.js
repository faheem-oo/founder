import React from 'react';
import styled from 'styled-components';
// Import the TSX component (extension omitted so the bundler/resolver can pick .tsx)
import DarkVeil from './DarkVeil';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 4;
  opacity: 0;
  animation: showDarkVeil 1s ease-out forwards;
  animation-delay: 0s;

  @keyframes showDarkVeil {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const DarkVeilCanvas = () => {
  return (
    <CanvasContainer>
      <DarkVeil
        hueShift={270}
        noiseIntensity={0.02}
        scanlineIntensity={0.1}
        speed={1.5}
        scanlineFrequency={0.02}
        warpAmount={0.1}
      />
    </CanvasContainer>
  );
};

export default DarkVeilCanvas;