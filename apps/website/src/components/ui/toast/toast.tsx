"use client";

import type { PropsWithChildren } from "react";

import { Toast, type ToastManagerAddOptions } from "@base-ui/react/toast";
import { cn, tv, type VariantProps } from "tailwind-variants";

import { XIcon } from "@/components/icons";

import styles from "./toast.module.css";

const toastVariants = tv({
  base: "rounded-xl bg-ddf-blue-950/60 text-white backdrop-blur-2xl",
  defaultVariants: {
    type: "default",
  },
  variants: {
    type: {
      default: "",
      error: "bg-red-500/60",
      info: "bg-blue-500/60",
      success: "bg-green-500/60",
      warning: "bg-yellow-500/60 text-black",
    },
  },
});

type AddToastOptions = Omit<ToastManagerAddOptions<object>, "type"> & {
  type?: ToastVariants["type"];
};

type ToastType = NonNullable<ToastVariants["type"]>;
type ToastVariants = VariantProps<typeof toastVariants>;

export function ToastProvider(props: PropsWithChildren) {
  return (
    <Toast.Provider>
      {props.children}
      <Toast.Portal>
        <Toast.Viewport className={styles.viewport}>
          <Toasts />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

export function useToast() {
  const manager = Toast.useToastManager();

  return {
    ...manager,
    add: (options: AddToastOptions) => manager.add(options),
  };
}

function isToastType(value: unknown): value is ToastType {
  return (
    typeof value === "string" &&
    Object.hasOwn(toastVariants.variants.type, value)
  );
}

function Toasts() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      className={toastVariants({
        className: styles.toast,
        type: isToastType(toast.type) ? toast.type : undefined,
      })}
      key={toast.id}
      toast={toast}
    >
      <Toast.Content className={cn(styles.content)}>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Toast.Title className="text-sm font-semibold" />
          <Toast.Description className="text-sm text-neutral-500" />
        </div>

        <Toast.Close aria-label="Schließen" className={styles.close}>
          <XIcon className="size-7" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
