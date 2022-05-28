import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'all')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const IconContainer = styled.div`
  position: relative;
  height: 60px;
  width: 100%;
  max-width: 350px;

  input[type='range'] {
    cursor: pointer;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0.35;

    &::-webkit-slider-thumb {
      width: 30px;
      height: 60px;
    }

    &::-moz-range-thumb {
      width: 30px;
      height: 60px;
    }
  }
`;

export const FragezeichenContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-column-gap: 4px;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  justify-items: center;
`;

export const FragezeichenIcon = styled.span`
  display: inline-block;
  background-image: url('/${(props) => props.icon}.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 60px;
  width: 100%;

  &:hover {
    background-image: url('/blue_small.png');
  }
`;

export const HoverValue = styled.div`
  min-width: 35px;
  text-align: right;
  font-size: 24px;
  margin-top: -12px;
`;
