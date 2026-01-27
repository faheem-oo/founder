"use client";
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const showNavigation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const GlassNav = styled.nav`
  position: fixed;
  top: 30px;
  left: 5%;
  width: 90vw;
  height: 60px;
  border-radius: 30px;
  z-index: 50;
  opacity: 0;
  animation: ${showNavigation} 1s ease-out forwards;
  animation-delay: 0s;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(4px) saturate(1.1) brightness(1.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
    0 2px 8px 0 rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    top: 25px;
    left: 3%;
    width: 94vw;
    height: 55px;
  }

  @media (max-width: 768px) {
    top: 20px;
    left: 2%;
    width: 96vw;
    height: 60px;
    border-radius: 30px;
  }

  @media (max-width: 600px) {
    top: 15px;
    left: 2%;
    width: 96vw;
    height: 58px;
    border-radius: 29px;
  }

  @media (max-width: 480px) {
    top: 10px;
    left: 2%;
    width: 96vw;
    height: 56px;
    border-radius: 28px;
  }

  @media (max-width: 320px) {
    top: 8px;
    left: 1%;
    width: 98vw;
    height: 54px;
    border-radius: 27px;
  }
`;

const NavContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-radius: inherit;

  @media (max-width: 1024px) {
    padding: 0 25px;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  @media (max-width: 600px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }

  @media (max-width: 320px) {
    padding: 0 8px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }

  @media (max-width: 320px) {
    gap: 6px;
  }
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;

  @media (max-width: 768px) {
    height: 28px;
  }

  @media (max-width: 480px) {
    height: 24px;
  }

  @media (max-width: 320px) {
    height: 20px;
  }
`;

const LogoText = styled.span`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: Arial, sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  @media (max-width: 320px) {
    font-size: 0.8rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;

  @media (max-width: 1024px) {
    gap: 50px;
  }

  @media (max-width: 768px) {
    gap: 35px;
  }

  @media (max-width: 600px) {
    gap: 25px;
  }

  @media (max-width: 480px) {
    gap: 15px;
  }

  @media (max-width: 320px) {
    gap: 8px;
  }
`;

const NavItem = styled.button`
  color: white;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.02);
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 7px 14px;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 12px;
    border-radius: 18px;
  }

  @media (max-width: 600px) {
    font-size: 0.75rem;
    padding: 5px 10px;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 12px;
  }

  @media (max-width: 320px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    border-radius: 10px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    transform: scale(1.05);
    backdrop-filter: blur(3px);
  }

  &:last-child {
    margin-right: 50px;

    @media (max-width: 1024px) {
      margin-right: 40px;
    }

    @media (max-width: 768px) {
      margin-right: 30px;
    }

    @media (max-width: 600px) {
      margin-right: 20px;
    }

    @media (max-width: 480px) {
      margin-right: 10px;
    }

    @media (max-width: 320px) {
      margin-right: 5px;
    }
  }
`;

const Navigation = ({ onNavigate = () => {}, onContactClick = () => {} }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // mark mounted on client after hydration to avoid SSR/CSR mismatch
    setMounted(true);
  }, []);

  return (
    <GlassNav>
      <NavContent>
        <LogoContainer>
          {/* render logo image and text only after client mount to avoid hydration mismatch */}
          {mounted && <LogoImage src="/imitate-logo.png" alt="Imitate Labs Logo" />}
          {mounted && <LogoText>IMITATE LABS</LogoText>}
        </LogoContainer>
      
      </NavContent>
    </GlassNav>
  );
};

export default Navigation;
