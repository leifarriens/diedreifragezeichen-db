import type { ComponentProps } from "react";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import Link from "next/link";
import { tv } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-neutral-100 px-6 py-2 transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
});

export type ButtonProps =
  AnchorButtonProps | NativeButtonProps | NextLinkButtonProps;

type AnchorButtonProps = ButtonBaseProps &
  Omit<ComponentProps<"a">, "className"> & {
    as: "a";
    href: string;
  };

interface ButtonBaseProps {
  className?: string;
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

export function Button(props: ButtonProps) {
  const className = buttonVariants({ className: props.className });

  if (props.as === "a") {
    const { as: Element, ...anchorProps } = props;
    return <Element {...anchorProps} className={className} />;
  }

  if (props.href !== undefined) {
    return <Link {...props} className={className} />;
  }

  return (
    <ButtonPrimitive
      {...props}
      className={className}
      type={props.type ?? "button"}
    />
  );
}
