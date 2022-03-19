import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'all')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

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

const HoverValue = styled.div`
  min-width: 35px;
  text-align: right;
  font-size: 24px;
  margin-top: -12px;
`;

// FIXME: fix variance between submitted range and hover
function RatingInput({ defaultValue = 0, onRate, disabled = false }) {
  const [range, setRange] = useState(defaultValue || 0);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    console.log('NEW', defaultValue);
    setRange(defaultValue);
  }, [defaultValue]);

  // console.log(range, hover);

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
    // setRange(0);
    onRate(hover);
    setHover(null);
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

  const handleTouchMove = (e) => {
    console.log(e);
  }

  const handleMouseOut = () => {
    setHover('');
  };

  const inputSettings = {
    type: 'range',
    min: 0.5, // needs to be 0.5 to equal input range and hover value
    max: 10,
    step: 0.5,
  };

  const getIcon = (index) => {
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

  return (
    <Container disabled={disabled}>
      <IconContainer>
        <input
          {...inputSettings}
          value={range}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseOut={handleMouseOut}
          onChange={handleValueChange}
          onMouseUp={handleInputEnd}
          onTouchEnd={handleInputEnd}
        />

        <FragezeichenContainer>
          {Array.from({ length: 10 }, (_, i) => (
            <FragezeichenIcon key={i} icon={getIcon(i)} />
          ))}
          {/* {[...Array(10)].map((_, index) => {
            return <FragezeichenIcon key={index} icon={getIcon(index)} />;
          })} */}
        </FragezeichenContainer>
      </IconContainer>
      <HoverValue>
        {hover ? hover.toFixed(1) : range > 0 && range.toFixed(1)}
      </HoverValue>
    </Container>
  );
}

export default RatingInput;
