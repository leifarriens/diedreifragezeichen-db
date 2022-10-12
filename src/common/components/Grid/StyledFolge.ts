import styled, { css, keyframes } from 'styled-components';

import { colors } from '@/constants/theme';

export const Cover = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    transition: border-radius 150ms, opacity 650ms ease-in;
    transition-timing-function: ease-out;
  }
`;

const bgWobble = keyframes`
  0% {
    transform: rotate(0deg) scale(2);
  }
  100% {
    transform: rotate(360deg) scale(2);
  }
`;

export const Background = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  background-color: #000e18;
  border-radius: 12px;
  opacity: 0;
  transition: all 150ms ease-out;
`;

export const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background-size: 150%, auto, cover;
  background-repeat: no-repeat;
  transition: all 300ms ease-out;
  filter: blur(16px) brightness(50%);
  opacity: 0;
  border-radius: 12px;
  animation-name: ${bgWobble};
  animation-play-state: paused;
  animation-duration: 26s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  /* Disables animation in firefox due to bad performance */
  @-moz-document url-prefix() {
    animation-name: none;
  }
`;

const hover = css`
  transform: scale(1.2);
  transform-origin: center;
  z-index: 10;
  box-shadow: 0 0 30px 6px rgba(0, 0, 0, 0.2);

  @media (hover: none) {
    transform: none;
  }

  ${Overlay} {
    opacity: 1;
    animation-play-state: running;
  }

  ${Background} {
    opacity: 1;
  }

  img {
    border-radius: 12px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (prefers-reduced-motion) {
    transform: none;
  }
`;

export const FolgeContainer = styled.article`
  position: relative;
  width: 100%;
  background-size: cover;
  transition: all 150ms ease-out;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    ${hover};
  }

  .bottom {
    font-size: 0.85em;
    padding: 6px 10px;
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;

    .release {
      font-weight: 200;
      font-size: 0.8em;
    }

    .right {
      display: flex;
      align-items: center;

      * + * {
        margin-left: 0.5em;
      }
    }
  }
`;

export const RatingBadge = styled.span`
  z-index: 8;
  display: grid;
  place-items: center;
  border-radius: 2px;
  padding: 2px 8px;
  min-width: 24px;
  font-size: 1.1em;
  background-color: ${colors.lightblue};
`;

export const NewBadge = styled.span`
  z-index: 8;
  position: absolute;
  right: -10px;
  top: -6px;
  display: grid;
  place-items: center;
  background-color: ${colors.lightblue};
  padding: 4px 6px;
  border-radius: 4px;
  text-transform: capitalize;
  box-shadow: 0 0 15px 0px rgba(0, 0, 0, 0.15);
  display: inline-block;
`;
