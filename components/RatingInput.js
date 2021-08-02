import React from 'react';
import styled from 'styled-components';

const IconContainer = styled.div`
  position: relative;
  height: 60px;
  width: 100%;
  max-width: 350px;
  /* width: 200px; */

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

const Fragezeichen = styled.span`
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

function RatingInput({ defaultValue = 0, onRate }) {
  const [range, setRange] = React.useState(defaultValue);

  React.useEffect(() => {
    setRange(defaultValue);
  }, [defaultValue]);

  const handleValueChange = (e) => {
    if (!isNaN(val)) return;

    const val = Number(e.target.value);

    const isIntOrPointFive = val % 1 === 0 || val % 1 === 0.5;
    if (val >= 1 && isIntOrPointFive) {
      setRange(val);
    }
  };

  const handleInputEnd = () => {
    if (range !== defaultValue) {
      onRate(range);
    }
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
          onChange={handleValueChange}
          onMouseLeave={handleInputEnd}
          onTouchEnd={handleInputEnd}
        />

        <FragezeichenContainer>
          {[...Array(10)].map((_, index) => {
            if (Math.floor(range) > index) {
              return (
                <Fragezeichen key={index} icon="blue_small"></Fragezeichen>
              );
            }

            if (index + 1 === Math.round(range)) {
              return (
                <Fragezeichen key={index} icon="half_small"></Fragezeichen>
              );
            }

            return <Fragezeichen key={index} icon="white_small"></Fragezeichen>;
          })}
        </FragezeichenContainer>
      </IconContainer>

      <div style={{ minWidth: '35px', textAlign: 'right' }}>
        {range > 0 && range.toFixed(1)}
      </div>
    </div>
  );
}

export default RatingInput;
