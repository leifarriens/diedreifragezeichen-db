"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import styles from "./slider.module.css";

const THUMB_SIZE = 24;

export type SliderProps<Value extends number | readonly number[]> = Pick<
  SliderPrimitive.Root.Props<Value>,
  | "disabled"
  | "largeStep"
  | "max"
  | "min"
  | "minStepsBetweenValues"
  | "name"
  | "onValueChange"
  | "onValueCommitted"
  | "step"
  | "thumbCollisionBehavior"
> & {
  ariaLabel?: string;
  thumbAriaLabels?: readonly string[];
  value: Value;
};

// Including a tuple in the constraint preserves tuple inference for array literals.
export function Slider<
  Value extends number | readonly [number, ...number[]] | readonly number[],
>({
  ariaLabel,
  max = 100,
  min = 0,
  minStepsBetweenValues = 1,
  thumbAriaLabels,
  thumbCollisionBehavior = "none",
  value,
  ...props
}: SliderProps<Value>) {
  const values = getValues(value);

  return (
    <SliderPrimitive.Root
      {...props}
      className="relative h-11 w-full max-w-[560px]"
      max={max}
      min={min}
      minStepsBetweenValues={minStepsBetweenValues}
      thumbAlignment="edge"
      thumbCollisionBehavior={thumbCollisionBehavior}
      value={value}
    >
      <SliderPrimitive.Control className={styles.control}>
        <SliderPrimitive.Track className={styles.track}>
          <SliderPrimitive.Indicator className={styles.indicator} />
          {values.map((_, index) => (
            <SliderPrimitive.Thumb
              aria-label={
                thumbAriaLabels?.[index] ??
                (typeof value === "number" ? ariaLabel : undefined)
              }
              className={styles.thumb}
              index={index}
              // eslint-disable-next-line @eslint-react/no-array-index-key
              key={index}
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>

      {values.map((thumbValue, index) => (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-9 z-[6] -translate-x-1/2 text-xs font-medium text-white tabular-nums"
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={index}
          style={{
            left: getThumbCenterPosition(thumbValue, min, max),
          }}
        >
          {thumbValue}
        </span>
      ))}
    </SliderPrimitive.Root>
  );
}

function getThumbCenterPosition(value: number, min: number, max: number) {
  const percent = max <= min ? 0 : ((value - min) / (max - min)) * 100;
  const offset = (THUMB_SIZE / 2) * (1 - (percent / 100) * 2);
  const operator = offset < 0 ? "-" : "+";
  return `calc(${percent.toString()}% ${operator} ${Math.abs(offset).toString()}px)`;
}

function getValues(value: number | readonly number[]): readonly number[] {
  return typeof value === "number" ? [value] : value;
}
