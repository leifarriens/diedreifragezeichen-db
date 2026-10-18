import { FOLGEN_RATING_MAX } from "@ddfdb/core";
import { useId } from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { tv, type VariantProps } from "tailwind-variants";

interface FolgenRatingDisplayProps extends RatingVariants {
  className?: string;
  folgenTitle: string;
  type: RatingType;
  value: null | number;
}

type RatingType = "community" | "user";

const SIZE_OPTIONS = {
  lg: { height: 48 },
  sm: { height: 20 },
  xl: { height: 64 },
} as const;

const ratingVariants = tv({
  defaultVariants: {
    size: "sm",
  },
  slots: {
    container: "flex-row items-center",
  },
  variants: {
    size: {
      lg: {
        container: "gap-0.5 h-12",
      },
      sm: {
        container: "gap-px h-5",
      },
      xl: {
        container: "gap-1 h-16",
      },
    },
  },
});

type RatingVariants = VariantProps<typeof ratingVariants>;

const COLORS: Record<RatingType, string> = {
  community: "#009ee1",
  user: "#e10613",
};

export function FolgenRatingDisplay({
  className,
  folgenTitle,
  size = "sm",
  type,
  value,
}: FolgenRatingDisplayProps) {
  const gradientPrefixId = useId().replaceAll(":", "");
  const { height } = SIZE_OPTIONS[size];
  const hasRating = !!value;
  const filledCount = hasRating ? Math.ceil(value) : 0;
  const placeholderOpacity = type === "user" ? 0.3 : 0.7;

  const { container } = ratingVariants({
    size,
  });

  return (
    <View
      accessibilityLabel={getAccessibilityLabel(type, folgenTitle, value)}
      accessibilityRole="image"
      accessible
      className="self-start"
      {...(className === undefined ? {} : { className })}
    >
      <View className={container()} style={{ height }}>
        {Array.from({ length: FOLGEN_RATING_MAX }).map((_, index) => {
          const isRated = index < filledCount;
          const isPartial =
            isRated &&
            index === filledCount - 1 &&
            value !== null &&
            value % 1 !== 0;
          const gradientId = `${gradientPrefixId}-${index.toString()}`;

          return (
            <Svg
              height={height}
              key={`q-${index.toString()}`}
              viewBox="69.376898 44.355714 80.167007 172.94348"
              width={height * 0.463545}
            >
              {isPartial ? (
                <Defs>
                  <LinearGradient id={gradientId} x1="0%" x2="100%">
                    <Stop offset="50%" stopColor={COLORS[type]} />
                    <Stop
                      offset="50%"
                      stopColor="#ffffff"
                      stopOpacity={placeholderOpacity}
                    />
                    <Stop
                      offset="100%"
                      stopColor="#ffffff"
                      stopOpacity={placeholderOpacity}
                    />
                  </LinearGradient>
                </Defs>
              ) : null}
              <Path
                d="m 98.018039,217.25774 -5.88698,-0.0966 v -19.17727 -19.17723 h 15.038991 15.039 l 0.17394,6.15156 c 0.0957,3.38336 0.17421,12.01539 0.17455,19.1823 l 6.1e-4,13.03072 h -3.39683 c -1.86825,0 -6.06521,0.0412 -9.32656,0.0916 -3.26136,0.0504 -8.57888,0.0481 -11.816721,-0.005 z m -3.50573,-62.0312 c 0,-14.83917 1.19108,-19.22469 8.062101,-29.68451 12.15846,-18.50897 16.02915,-27.66941 15.67239,-37.090589 -0.25416,-6.711556 -2.15172,-10.860924 -5.79772,-12.677801 -2.01654,-1.004884 -6.33301,-1.008535 -8.34271,-0.0071 -4.327761,2.156615 -6.415101,8.626602 -6.418421,19.894754 l -6.4e-4,2.182806 h -14.15521 -14.1552 v -3.004276 c 0,-21.346939 8.03126,-38.350456 21.73333,-46.013093 14.545381,-8.13424 36.950191,-4.821245 48.094231,7.111686 7.03202,7.529816 10.34392,17.518301 10.33945,31.183125 -0.005,14.298998 -2.85583,21.920628 -15.3441,41.017348 -10.33186,15.79922 -11.88498,19.35946 -12.69638,29.10417 -0.14541,1.74625 -0.33848,3.80008 -0.42906,4.56406 l -0.1647,1.38907 H 107.71099 94.512309 Z"
                fill={
                  isPartial
                    ? `url(#${gradientId})`
                    : isRated
                      ? COLORS[type]
                      : "#ffffff"
                }
                fillOpacity={isRated ? 1 : placeholderOpacity}
              />
            </Svg>
          );
        })}
      </View>
    </View>
  );
}

function getAccessibilityLabel(
  type: RatingType,
  folgenTitle: string,
  value: null | number,
) {
  if (type === "community") {
    return value
      ? `${folgenTitle} hat eine Bewertung von ${value.toString()} von 3`
      : `${folgenTitle} hat noch keine Bewertung`;
  }

  return value
    ? `Du hast ${folgenTitle} mit ${value.toString()} von 3 bewertet`
    : `Du hast ${folgenTitle} noch nicht bewertet`;
}
