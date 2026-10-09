"use client";

import { useRouter } from "next/navigation";
import { type SyntheticEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

type FormMode = "sign-in" | "sign-up";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<FormMode>("sign-in");
  const [error, setError] = useState<null | string>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = readString(formData, "email");
    const password = readString(formData, "password");

    try {
      const result =
        mode === "sign-in"
          ? await authClient.signIn.email({
              callbackURL: "/profil",
              email,
              password,
            })
          : await authClient.signUp.email({
              callbackURL: "/profil",
              email,
              name: readString(formData, "name"),
              password,
            });

      if (result.error) {
        setError(result.error.message ?? "Could not authenticate.");
        return;
      }

      router.replace("/profil");
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not authenticate.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
      {mode === "sign-up" && (
        <label className="block space-y-1.5 text-sm font-medium">
          Name
          <input
            autoComplete="name"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 font-normal outline-none focus:border-blue-600 dark:border-zinc-700"
            maxLength={100}
            name="name"
            required
          />
        </label>
      )}
      <label className="block space-y-1.5 text-sm font-medium">
        Email
        <input
          autoComplete="email"
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 font-normal outline-none focus:border-blue-600 dark:border-zinc-700"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="block space-y-1.5 text-sm font-medium">
        Password
        <input
          autoComplete={
            mode === "sign-in" ? "current-password" : "new-password"
          }
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 font-normal outline-none focus:border-blue-600 dark:border-zinc-700"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </label>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending
          ? "Please wait..."
          : mode === "sign-in"
            ? "Sign in"
            : "Create account"}
      </button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {mode === "sign-in" ? "New here?" : "Already have an account?"}{" "}
        <button
          className="font-medium text-blue-700 hover:underline dark:text-blue-400"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          }}
          type="button"
        >
          {mode === "sign-in" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </form>
  );
}

function readString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
}
