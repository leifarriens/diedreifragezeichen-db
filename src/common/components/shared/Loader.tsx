import classnames from 'classnames';
import styled, { keyframes } from 'styled-components';

export function FullpageLoader() {
  return (
    <FullpageContainer>
      <Loader />
    </FullpageContainer>
  );
}

export function Loader({ animated = true }: { animated?: boolean }) {
  return (
    <LoadingIndicator className="loader">
      {Array.from({ length: 3 }).map((_, index) => (
        <IndicatorIcon key={index} className={classnames({ animated })} />
      ))}
    </LoadingIndicator>
  );
}

export function SpinningLoader({ width }: { width?: string }) {
  return <SpinningIndicator $width={width} aria-label="Loading" />;
}

const SpinningIndicator = styled.div<{ $width?: string }>`
  width: ${({ $width }) => $width ?? '35px'};
  aspect-ratio: 1;
  border: 5px solid #808080;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

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
  margin: 1em 0;
  line-height: 1;
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
