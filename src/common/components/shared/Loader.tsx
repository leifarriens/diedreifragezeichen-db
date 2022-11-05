import classnames from 'classnames';
import { RotatingLines } from 'react-loader-spinner';
import styled, { keyframes } from 'styled-components';

export const FullpageLoader = () => (
  <FullpageContainer>
    <Loader />
  </FullpageContainer>
);

export const Loader = ({ animated = true }) => (
  <LoadingIndicator className="loader">
    {Array.from({ length: 3 }).map((_, index) => (
      <IndicatorIcon key={index} className={classnames({ animated })} />
    ))}
  </LoadingIndicator>
);

export const SpinningLoader = ({ width }: { width?: string }) => (
  <RotatingLines
    strokeColor="grey"
    strokeWidth="5"
    animationDuration="0.75"
    width={width}
    visible={true}
  />
);

const FullpageContainer = styled.div`
  z-index: 999px;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  display: flex;
  align-items: center;
`;

const scaleAnimation = keyframes`
  0%,
  40%,
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
  20% {
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  font-size: 42px;
`;

const IndicatorIcon = styled.div`
  height: 100%;
  display: inline-block;

  transform-origin: center;
  color: #e4e4e4;
  font-family: 'Open Sans Condensed', sans-serif;
  letter-spacing: -8;
  background-image: url(/white_small.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 18px;
  height: 32px;

  &.animated {
    animation: ${scaleAnimation} 1.2s infinite ease-in-out;
  }

  &:nth-of-type(2) {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  &:nth-of-type(3) {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
`;
