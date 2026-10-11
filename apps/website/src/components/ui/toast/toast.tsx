"use client";
import { Toast } from "@base-ui/react/toast";
import * as React from "react";
import { cn } from "tailwind-variants";

import styles from "./toast.module.css";

export function ToastProvider(props: { children: React.ReactNode }) {
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

function Toasts() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      className={cn(styles.toast, "rounded-xl bg-[#000b0e] text-[#fffffc]")}
      key={toast.id}
      toast={toast}
    >
      <Toast.Content className={cn(styles.content)}>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Toast.Title className="text-sm font-bold" />
          <Toast.Description className="text-sm text-neutral-700" />
        </div>

        <Toast.Close aria-label="Schließen" className={styles.close}>
          <XIcon />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

export const useToast = Toast.useToastManager;

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m2.5 2.5 11 11m-11 0 11-11" />
    </svg>
  );
}
