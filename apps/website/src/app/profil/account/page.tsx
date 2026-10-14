import type { Metadata } from "next";

const TITLE = "Account";

export const metadata: Metadata = {
  title: TITLE,
};

export default function RatingsPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>

      <div></div>
    </>
  );
}
