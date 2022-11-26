import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Container,
  FragezeichenContainer,
  FragezeichenIcon,
  HoverValue,
  IconContainer,
} from './StyledRatingInput';

type RatingInputProps = {
  defaultValue: number | undefined;
  disabled: boolean;
  onRate: (newRating: number) => void;
};

function RatingInput({
  defaultValue = 0,
  onRate,
  disabled = false,
}: RatingInputProps) {
  const [range, setRange] = useState(defaultValue || 0);
  const [hover, setHover] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) {
      return setRange(defaultValue);
    }

    setRange(0);
  }, [defaultValue]);

  const reset = useCallback(() => {
    setRange(defaultValue);
    setHover(null);
  }, [defaultValue]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(parseFloat(e.target.value));

    if (val === 0) return;

    const isIntOrPointFive = val % 1 === 0 || val % 1 === 0.5;
    if (val >= 1 && isIntOrPointFive) {
      setRange(val);
    }
  };

  const handleInputEnd = useCallback(() => {
    setHover(null);
    if (range) onRate(range);
  }, [range, onRate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = inputRef.current?.getBoundingClientRect();

    if (rect) {
      const mouseElementOffsetX = e.nativeEvent.offsetX;
      const targetElementWidth = rect.width;

      calcHoverValue(mouseElementOffsetX, targetElementWidth);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
    const rect = inputRef.current?.getBoundingClientRect();

    if (rect) {
      const touchElementOffsetX = e.targetTouches[0].clientX - rect.left;
      const targetElementWidth = rect.width;

      calcHoverValue(touchElementOffsetX, targetElementWidth);
    }
  };

  const calcHoverValue = (elementOffset: number, elementWidth: number) => {
    if (elementOffset < 0 || elementOffset > elementWidth) {
      return;
    }

    const sliderHoverValue = Math.abs((elementOffset / elementWidth) * 10);

    const rounded = (Math.ceil((sliderHoverValue * 10) / 5) * 5) / 10;

    setHover(rounded < 1 ? 1 : rounded);
  };

  useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'Enter') handleInputEnd();
    }
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reset, handleInputEnd]);

  useEffect(() => {
    if (range === defaultValue) {
      inputRef.current?.blur();
    }
  }, [range, defaultValue]);

  const inputSettings = {
    type: 'range',
    min: 0.5, // needs to be 0.5 to equal input range and hover value
    max: 10,
    step: 0.5,
  };

  const getIcon = (index: number) => {
    if (hover && index < hover && hover - index > 0.5) {
      return 'blue_small';
    }

    if (hover && index < hover) {
      return 'half_small';
    }

    if (!hover && range - 1 >= index) {
      return 'blue_small';
    }

    if (!hover && range > index && range % 1 != 0) {
      return 'half_small';
    }

    return 'white_small';
  };

  return (
    <Container disabled={disabled}>
      <IconContainer onSubmit={handleInputEnd}>
        {/* DISCUSS: implement with <form> ? */}
        <input
          ref={inputRef}
          {...inputSettings}
          value={range}
          onChange={handleValueChange}
          onMouseUp={handleInputEnd}
          onTouchEnd={handleInputEnd}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          onMouseOut={reset}
          onBlur={reset}
        />

        <FragezeichenContainer>
          {Array.from({ length: 10 }, (_, i) => (
            <FragezeichenIcon key={i} icon={getIcon(i)} />
          ))}
        </FragezeichenContainer>
      </IconContainer>
      <HoverValue>
        {hover ? hover.toFixed(1) : range > 0 && range.toFixed(1)}
      </HoverValue>
    </Container>
  );
}

export default RatingInput;
