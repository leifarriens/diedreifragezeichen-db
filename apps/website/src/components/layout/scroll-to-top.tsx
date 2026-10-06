"use client";
import { useEffect, useRef, useState } from "react";

export function ScrollToTop() {
  const scrollTopRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleVisibility = () => {
    const { innerHeight, scrollY } = window;

    setIsVisible(scrollY >= 100);
    setIsAtBottom(innerHeight + scrollY >= document.body.offsetHeight - 20);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleVisibility);

    return () => {
      window.removeEventListener("scroll", handleVisibility);
    };
  }, []);

  const handleClick = () => {
    window.scroll({ behavior: "smooth", top: 0 });
  };

  return (
    <div
      className="fixed right-0 bottom-0 z-20 grid h-20 w-20 place-items-center transition-opacity duration-150 ease-in"
      ref={scrollTopRef}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <button
        aria-label="Zum Seitenanfang scrollen"
        className="cursor-pointer transition-transform duration-200 ease-in"
        onClick={handleClick}
        style={{
          transform: isAtBottom ? `translateY(-100%)` : `translateY(0px)`,
        }}
        type="button"
      >
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
