import styled, { keyframes } from 'styled-components';

import { colors } from '../../theme';

export const Cover = styled.div`
  width: 100%;
  height: auto;

  img {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const bgWobble = keyframes`
  0% {
    transform: rotate(0deg) scale(4);
    filter: blur(22px) brightness(60%);
  }
  50% {
    filter: blur(12px) brightness(60%);
  }
  100% {
    transform: rotate(360deg) scale(4);
    filter: blur(22px) brightness(60%);
  }
`;

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-position: center;
  background-size: 150%, auto, cover;
  transition: all 300ms ease-out;
  filter: blur(24px) brightness(60%);
  opacity: 0;
  border-radius: 12px;
  /* animation-name: ${bgWobble}; */
  /* animation-play-state: paused; */
  /* animation-delay: 2s; */
  animation-duration: 20s;
  /* margin-bottom: -100px; */
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const Background = styled.div`
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

export const FolgeContainer = styled.article`
  z-index: 1;
  position: relative;
  width: 100%;
  background-size: cover;
  transition: all 150ms ease-out;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;

  img {
    border-radius: 12px;
    transition: border-radius 150ms ease-out;
  }

  .text {
    font-size: 0.85em;
    padding: 6px 10px;
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &:hover {
    transform: scale(1.2);
    transform-origin: center;
    z-index: 10;
    box-shadow: 0 0 30px 6px rgba(0, 0, 0, 0.2);

    /* @media screen and (max-width: 560px) {
      transform: none;
    } */

    @media (hover: none) {
      transform: none;
    }

    ${Overlay} {
      opacity: 1;
      /* animation-play-state: running; */
    }

    ${Background} {
      opacity: 1;
    }

    img {
      border-radius: 12px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
`;

FolgeContainer.Background = Background;
FolgeContainer.Overlay = Overlay;

export const RatingBadge = styled.span`
  z-index: 8;
  display: grid;
  place-items: center;
  border-radius: 4px;
  padding: 4px 10px;
  background-color: ${colors.lightblue};
  /* background-image: url('/blue.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain; */
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
