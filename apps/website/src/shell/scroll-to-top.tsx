"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleVisibility = () => {
    const { innerHeight, scrollY } = window;

    setIsVisible(scrollY >= 100);
    setIsAtBottom(innerHeight + scrollY >= document.body.offsetHeight - 20);
  };

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(handleVisibility);
    window.addEventListener("scroll", handleVisibility, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleVisibility);
    };
  }, []);

  const handleClick = () => {
    window.scroll({ behavior: "smooth", top: 0 });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 bottom-0 z-20 grid h-20 w-20 place-items-center">
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
          fill="currentColor"
          height="32"
          viewBox="0 0 256 256"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"></path>
        </svg>
      </button>
    </div>
  );
}
