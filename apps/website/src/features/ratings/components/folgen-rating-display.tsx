import { useId } from "react";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { QSvg } from "@/components/icons/q";

const MAX_RATING = 3;

interface FolgenRatingDisplayProps extends RatingVariants {
  className?: string;
  folgenTitle: string;
  type: type;
  value: null | number;
}

const rating = tv({
  defaultVariants: {
    size: "sm",
  },
  slots: {
    container: "h-16 w-fit",
    iconContainer: "gap-x-1",
  },
  variants: {
    size: {
      lg: {
        container: "h-12",
        iconContainer: "gap-x-[2px] px-[1px] py-[1px]",
      },
      sm: {
        container: "h-5",
        iconContainer: "gap-x-[1px] py-[1px]",
      },
      xl: {
        container: "h-16",
        iconContainer: "gap-x-1 px-[2px] py-[1px]",
      },
    },
  },
});

type RatingVariants = VariantProps<typeof rating>;

type type = "community" | "user";

const colors: Record<type, [string, string, string]> = {
  community: ["#009ee1", "#009ee1", "#009ee1"],
  user: ["#e10613", "#e10613", "#e10613"],
};

export function FolgenRatingDisplay({
  className,
  folgenTitle,
  size,
  type,
  value,
}: FolgenRatingDisplayProps) {
  const hasRating = !!value;
  const filledCount = hasRating ? Math.ceil(value) : 0;
  const gradientId = useId().replaceAll(":", "");
  const placeholderOpacity = type === "user" ? 0.3 : 0.7;

  const { container, iconContainer } = rating({
    size,
  });

  return (
    <div className={className}>
      <div
        aria-label={getAriaLabel(type, folgenTitle, value)}
        className={container()}
      >
        <div className={cn("flex h-full items-center", iconContainer())}>
          {Array.from({ length: MAX_RATING }).map((_, index) => {
            const isRated = index < filledCount;
            const isPartial =
              isRated &&
              index === filledCount - 1 &&
              value !== null &&
              value % 1 !== 0;
            const iconClassName = isRated
              ? "animate-fade-in"
              : type === "user"
                ? "opacity-30"
                : "opacity-70";
            const iconGradientId = `${gradientId}-${index.toString()}`;

            return (
              <QSvg
                className={cn("h-full w-auto", iconClassName)}
                color={isRated ? colors[type][index] : "#ffffff"}
                fill={isPartial ? `url(#${iconGradientId})` : undefined}
                key={`q-${index.toString()}`}
              >
                {isPartial && (
                  <defs>
                    <linearGradient id={iconGradientId} x1="0%" x2="100%">
                      <stop offset="50%" stopColor={colors[type][index]} />
                      <stop
                        offset="50%"
                        stopColor="#ffffff"
                        stopOpacity={placeholderOpacity}
                      />
                      <stop
                        offset="100%"
                        stopColor="#ffffff"
                        stopOpacity={placeholderOpacity}
                      />
                    </linearGradient>
                  </defs>
                )}
              </QSvg>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getAriaLabel(type: type, folgenTitle: string, value: null | number) {
  switch (type) {
    case "community":
      if (value) {
        return `${folgenTitle} hat eine Bewertung von ${value.toString()} von 3`;
      } else {
        return `${folgenTitle} hat noch keine Bewertung`;
      }
    case "user":
      if (value) {
        return `Du hast ${folgenTitle} mit ${value.toString()} von 3 bewertet`;
      } else {
        return `Du hast ${folgenTitle} noch nicht bewertet`;
      }
  }
}
