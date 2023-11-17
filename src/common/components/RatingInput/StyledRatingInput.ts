import styled from 'styled-components';

export const IconContainer = styled.form`
  display: block;
  position: relative;
  height: 60px;
  width: 100%;
  max-width: 350px;

  &:has(input[type='range']:focus) {
    box-shadow: var(--ui-outline);
  }

  input[type='range'] {
    cursor: pointer;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;

    &::-webkit-slider-thumb {
      width: 40px;
      height: 60px;
    }

    &::-moz-range-thumb {
      width: 30px;
      height: 60px;
    }
  }
`;

export const FragezeichenContainer = styled.label`
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

export const FragezeichenIcon = styled.span<{ icon: string }>`
  display: inline-block;
  background-image: url('/${(props) => props.icon}.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 60px;
  width: 100%;
`;
