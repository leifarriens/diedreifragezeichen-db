// @vitest-environment jsdom

import type { Slider as SliderPrimitive } from "@base-ui/react/slider";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from "vitest";

import { Slider } from "./slider";

async function renderSlider(ui: Parameters<typeof render>[0]) {
  const result = render(ui);
  await waitFor(() => {
    expect(screen.getAllByRole("slider").length).toBeGreaterThan(0);
  });
  return result;
}

const MIN_YEAR = 1979;
const MAX_YEAR = 2026;

function RangeSlider({
  onChange,
  onValueCommitted,
}: {
  onChange?: (value: [number, number]) => void;
  onValueCommitted?: SliderPrimitive.Root.Props<
    [number, number]
  >["onValueCommitted"];
}) {
  const [value, setValue] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  return (
    <Slider
      max={MAX_YEAR}
      min={MIN_YEAR}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        onChange?.(nextValue);
      }}
      onValueCommitted={onValueCommitted}
      thumbAriaLabels={[
        "Frühestes Erscheinungsjahr",
        "Spätestes Erscheinungsjahr",
      ]}
      value={value}
    />
  );
}

function SingleValueSlider({
  onChange,
  onValueCommitted,
}: {
  onChange?: (value: number) => void;
  onValueCommitted?: SliderPrimitive.Root.Props<number>["onValueCommitted"];
}) {
  const [value, setValue] = useState(56);
  return (
    <Slider
      ariaLabel="Volume"
      onValueChange={(nextValue) => {
        setValue(nextValue);
        onChange?.(nextValue);
      }}
      onValueCommitted={onValueCommitted}
      value={value}
    />
  );
}

beforeEach(() => {
  // JSDOM has no layout. Edge-aligned thumbs need non-zero dimensions.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return this.hasAttribute("data-index")
        ? new DOMRect(0, 0, 24, 24)
        : new DOMRect(0, 0, 300, 44);
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Slider", () => {
  it("supports a single numeric value", async () => {
    await renderSlider(<SingleValueSlider />);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveProperty(
      "value",
      "56",
    );
    expect(screen.getByText("56")).toBeTruthy();
  });

  it("starts with the provided minimum and maximum values", async () => {
    await renderSlider(<RangeSlider />);
    expect(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1979");
    expect(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "2026");
  });

  it("centers the endpoint labels on their slider thumbs", async () => {
    await renderSlider(<RangeSlider />);
    const minimumLabel = screen.getByText(MIN_YEAR.toString());
    const maximumLabel = screen.getByText(MAX_YEAR.toString());
    expect(minimumLabel.style.left).toBe("calc(0% + 12px)");
    expect(maximumLabel.style.left).toBe("calc(100% - 12px)");
    expect(minimumLabel.className).toContain("-translate-x-1/2");
    expect(maximumLabel.className).toContain("-translate-x-1/2");
  });

  it("keeps both handles within bounds and at least one step apart", async () => {
    await renderSlider(<RangeSlider />);
    const minimumSlider = screen.getByRole("slider", {
      name: "Frühestes Erscheinungsjahr",
    });
    const maximumSlider = screen.getByRole("slider", {
      name: "Spätestes Erscheinungsjahr",
    });
    fireEvent.change(minimumSlider, { target: { value: "1900" } });
    fireEvent.change(maximumSlider, { target: { value: "2100" } });
    expect(minimumSlider).toHaveProperty("value", "1979");
    expect(maximumSlider).toHaveProperty("value", "2026");
    fireEvent.change(maximumSlider, { target: { value: "1980" } });
    fireEvent.change(minimumSlider, { target: { value: "2026" } });
    expect(minimumSlider).toHaveProperty("value", "1979");
    expect(maximumSlider).toHaveProperty("value", "1980");
  });

  it("supports keyboard adjustment on both range thumbs", async () => {
    await renderSlider(<RangeSlider />);
    const minimumSlider = screen.getByRole("slider", {
      name: "Frühestes Erscheinungsjahr",
    });
    const maximumSlider = screen.getByRole("slider", {
      name: "Spätestes Erscheinungsjahr",
    });
    fireEvent.keyDown(minimumSlider, { key: "ArrowRight" });
    fireEvent.keyDown(maximumSlider, { key: "ArrowLeft" });
    expect(minimumSlider).toHaveProperty("value", "1980");
    expect(maximumSlider).toHaveProperty("value", "2025");
  });

  it("reports every range change immediately", async () => {
    const onChange = vi.fn();
    await renderSlider(<RangeSlider onChange={onChange} />);
    fireEvent.change(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
      { target: { value: "2000" } },
    );
    expect(onChange).toHaveBeenLastCalledWith([2000, MAX_YEAR]);
    fireEvent.change(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
      { target: { value: "2020" } },
    );
    expect(onChange).toHaveBeenLastCalledWith([2000, 2020]);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("reports scalar changes and commits with the primitive event details", async () => {
    const onChange = vi.fn();
    const onValueCommitted = vi.fn();
    await renderSlider(
      <SingleValueSlider
        onChange={onChange}
        onValueCommitted={onValueCommitted}
      />,
    );
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volume" }), {
      key: "ArrowRight",
    });
    expect(onChange).toHaveBeenCalledWith(57);
    expect(onValueCommitted).toHaveBeenCalledWith(
      57,
      expect.objectContaining({ reason: "keyboard" }),
    );
  });

  it("reports range commits", async () => {
    const onValueCommitted = vi.fn();
    await renderSlider(<RangeSlider onValueCommitted={onValueCommitted} />);
    fireEvent.keyDown(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
      { key: "ArrowRight" },
    );
    expect(onValueCommitted).toHaveBeenCalledWith(
      [1980, MAX_YEAR],
      expect.objectContaining({ reason: "keyboard" }),
    );
  });

  it("does not report a commit when the value has not changed", async () => {
    const onValueCommitted = vi.fn();
    await renderSlider(<RangeSlider onValueCommitted={onValueCommitted} />);
    fireEvent.keyDown(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
      { key: "ArrowLeft" },
    );
    expect(onValueCommitted).not.toHaveBeenCalled();
  });

  it("disables the slider inputs", async () => {
    await renderSlider(<Slider ariaLabel="Volume" disabled value={23} />);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("infers scalar and tuple callback types", async () => {
    await renderSlider(
      <>
        <Slider
          ariaLabel="Volume"
          onValueChange={(value, details) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            expectTypeOf(
              details,
            ).toEqualTypeOf<SliderPrimitive.Root.ChangeEventDetails>();
          }}
          onValueCommitted={(value, details) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            expectTypeOf(
              details,
            ).toEqualTypeOf<SliderPrimitive.Root.CommitEventDetails>();
          }}
          value={23}
        />
        <Slider
          onValueChange={(value) => {
            expectTypeOf(value).toEqualTypeOf<[number, number]>();
          }}
          onValueCommitted={(value) => {
            expectTypeOf(value).toEqualTypeOf<[number, number]>();
          }}
          thumbAriaLabels={["Minimum", "Maximum"]}
          value={[32, 34]}
        />
      </>,
    );
    expect(screen.getAllByRole("slider")).toHaveLength(3);
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volume" }), {
      key: "ArrowRight",
    });
    fireEvent.keyDown(screen.getByRole("slider", { name: "Minimum" }), {
      key: "ArrowRight",
    });
  });

  it("supports readonly tuples and arbitrary arrays", async () => {
    const tuple = [32, 34] as const;
    const values: number[] = [10, 30, 60];
    await renderSlider(
      <>
        <Slider
          onValueChange={(value) => {
            expectTypeOf(value).toEqualTypeOf<typeof tuple>();
          }}
          value={tuple}
        />
        <Slider
          onValueCommitted={(value) => {
            expectTypeOf(value).toEqualTypeOf<number[]>();
          }}
          thumbAriaLabels={["Low", "Middle", "High"]}
          value={values}
        />
      </>,
    );
    expect(screen.getAllByRole("slider")).toHaveLength(5);
    expect(screen.getByRole("slider", { name: "Middle" })).toHaveProperty(
      "value",
      "30",
    );
  });

  it("reflects externally restored values without emitting callbacks", async () => {
    const onValueChange = vi.fn();
    const onValueCommitted = vi.fn();
    const { rerender } = await renderSlider(
      <Slider
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        thumbAriaLabels={["Minimum", "Maximum"]}
        value={[10, 90]}
      />,
    );
    rerender(
      <Slider
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        thumbAriaLabels={["Minimum", "Maximum"]}
        value={[20, 80]}
      />,
    );
    expect(screen.getByRole("slider", { name: "Minimum" })).toHaveProperty(
      "value",
      "20",
    );
    expect(screen.getByRole("slider", { name: "Maximum" })).toHaveProperty(
      "value",
      "80",
    );
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onValueCommitted).not.toHaveBeenCalled();
  });
});
