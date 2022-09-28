import classnames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { colors } from '@/constants/theme';

type ChangeEvent = {
  min: number;
  max: number;
};

type MultiRangeInputProps = {
  min: number;
  max: number;
  onChange: (event: ChangeEvent) => void;
};

const MultiRangeInput = ({ min, max, onChange }: MultiRangeInputProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <Container>
      <RangeInput
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames('thumb thumb--zindex-3', {
          'thumb--zindex-5': minVal > max - 100,
        })}
      />
      <RangeInput
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />
      <div className="track" />
      <div ref={range} className="range">
        <div className="bar" />
        <div className="values">
          <span>{minVal}</span>
          <span>{maxVal}</span>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  --slider-height: 8px;
  position: relative;
  width: 100%;
  padding-bottom: 18px;
  margin: 1em 0;

  .track,
  .range {
    border-radius: 3px;
    height: var(--slider-height);
    margin-top: -4px;
    position: absolute;
  }

  .track {
    background-color: ${colors.white};
    width: 100%;
    margin-top: -4px;
    z-index: 1;
  }

  .range {
    width: 100%;
    z-index: 2;

    .bar {
      width: 100%;
      z-index: 2;
      height: 8px;
      border-radius: 3px;
      background-color: ${colors.lightblue};
    }

    .values {
      margin-top: 8px;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
    }
  }
`;

const thumb = css`
  background-color: ${colors.white};
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px ${colors.gray};
  cursor: pointer;
  height: var(--thumb-size);
  width: var(--thumb-size);
  pointer-events: all;
`;

const RangeInput = styled.input`
  --thumb-size: 20px;
  height: 8px;
  box-shadow: none !important;

  &.thumb,
  &.thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  &.thumb {
    pointer-events: none;
    position: absolute;
    height: 0;
    width: 100%;
  }

  &.thumb--zindex-3 {
    z-index: 3;
  }

  &.thumb--zindex-4 {
    z-index: 4;
  }

  &.thumb--zindex-5 {
    z-index: 5;
  }

  /* For Chrome */
  &.thumb::-webkit-slider-thumb {
    ${thumb};
  }

  /* For Firefox */
  &.thumb::-moz-range-thumb {
    ${thumb};
  }

  &:focus {
    &.thumb::-webkit-slider-thumb {
      box-shadow: var(--ui-outline);
    }

    &.thumb::-moz-range-thumb {
      box-shadow: var(--ui-outline);
    }
  }
`;

export default MultiRangeInput;
