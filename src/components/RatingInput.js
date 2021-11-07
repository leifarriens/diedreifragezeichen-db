import { useEffect, useState } from 'react';
import styled from 'styled-components';

const IconContainer = styled.div`
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
    opacity: 0;

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

const FragezeichenContainer = styled.div`
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

const FragezeichenIcon = styled.span`
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

// FIXME: fix variance between submitted range and hover
function RatingInput({ defaultValue = 0, onRate }) {
  const [range, setRange] = useState(defaultValue || 1);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    setRange(defaultValue);
  }, [defaultValue]);

  const handleValueChange = (e) => {
    if (!isNaN(val)) return;

    const val = Number(e.target.value);

    if (val === 0) return;

    const isIntOrPointFive = val % 1 === 0 || val % 1 === 0.5;
    if (val >= 1 && isIntOrPointFive) {
      setRange(val);
    }
  };

  const handleInputEnd = () => {
    onRate(hover);
  };

  const handleMouseMove = (e) => {
    const mouseElementOffsetX = e.nativeEvent.offsetX;
    const targetElementWidth = e.target.clientWidth;

    if (mouseElementOffsetX < 0 || mouseElementOffsetX > targetElementWidth) {
      return;
    }

    const sliderHoverValue = Math.abs(
      (mouseElementOffsetX / targetElementWidth) * parseInt(10, 10)
    );

    const rounded = (Math.ceil((sliderHoverValue * 10) / 5) * 5) / 10;

    setHover(rounded < 1 ? 1 : rounded);
  };

  const handleMouseOut = () => {
    setHover(null);
  };

  const inputSettings = {
    type: 'range',
    min: 1,
    max: 10,
    step: 0.5,
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <IconContainer>
        <input
          {...inputSettings}
          value={range}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
          onChange={handleValueChange}
          onMouseUp={handleInputEnd}
          onTouchEnd={handleInputEnd}
        />

        <FragezeichenContainer>
          {[...Array(10)].map((_, index) => {
            const icon = () => {
              if (hover && index < hover && hover - index > 0.5) {
                return 'blue_small';
              }

              if (hover && index < hover) {
                return 'half_small';
              }

              if (!hover && range - 1 >= index) {
                return 'blue_small';
              }

              if (range > index && range % 1 != 0) {
                return 'half_small';
              }

              return 'white_small';
            };

            return <FragezeichenIcon key={index} icon={icon()} />;
          })}
        </FragezeichenContainer>
      </IconContainer>
      <div style={{ minWidth: '35px', textAlign: 'right', fontSize: '24px' }}>
        {hover ? hover.toFixed(1) : range > 0 && range.toFixed(1)}
      </div>
    </div>
  );
}

export default RatingInput;
