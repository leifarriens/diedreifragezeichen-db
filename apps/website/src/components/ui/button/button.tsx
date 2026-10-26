import type { ComponentProps } from "react";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import Link from "next/link";
import { tv, type VariantProps } from "tailwind-variants";

import { LoadingIndicator } from "../loading-indicator/loading-indicator";

export const buttonVariants = tv({
  base: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-6 py-2 text-base font-semibold transition-colors disabled:opacity-50",
  defaultVariants: {
    intent: "default",
  },
  variants: {
    intent: {
      danger:
        "border-ddf-red-500 bg-ddf-red-500 text-white hover:not-disabled:border-ddf-red-400 hover:not-disabled:bg-ddf-red-400",
      default:
        "border-neutral-100 hover:not-disabled:bg-neutral-100 hover:not-disabled:text-black",
      primary:
        "border-ddf-blue-500 bg-ddf-blue-500 text-white hover:not-disabled:border-ddf-blue-400 hover:not-disabled:bg-ddf-blue-400",
    },
  },
});

export type ButtonProps =
  AnchorButtonProps | NativeButtonProps | NextLinkButtonProps;

type AnchorButtonProps = ButtonBaseProps &
  Omit<ComponentProps<"a">, "className"> & {
    as: "a";
    href: string;
  };

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  isLoading?: boolean;
}

type NativeButtonProps = ButtonBaseProps &
  Omit<ComponentProps<"button">, "className"> & {
    as?: never;
    href?: never;
  };

type NextLinkButtonProps = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, "className"> & {
    as?: never;
  };

export function Button({ isLoading = false, ...props }: ButtonProps) {
  const className = buttonVariants({
    className: props.className,
    intent: props.intent,
  });

  const children = isLoading ? (
    <LoadingIndicator type="spinner" />
  ) : (
    props.children
  );

  if (props.as === "a") {
    const { as: Element, ...anchorProps } = props;
    return (
      <Element {...anchorProps} className={className}>
        {children}
      </Element>
    );
  }

  if (props.href !== undefined) {
    return (
      <Link {...props} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <ButtonPrimitive
      {...props}
      className={className}
      disabled={isLoading || props.disabled}
      type={props.type ?? "button"}
    >
      {children}
    </ButtonPrimitive>
  );
}
