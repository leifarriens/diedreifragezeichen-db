import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';

export function ScrollToTop() {
  const scrollTopRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('scroll', handleVisibility);

    return () => {
      window.removeEventListener('scroll', handleVisibility);
    };
  }, []);

  const handleVisibility = () => {
    const { scrollY, innerHeight } = window;

    setIsVisible(scrollY >= 100);
    setIsAtBottom(innerHeight + scrollY >= document.body.offsetHeight - 20);
  };

  const handleClick = async () => {
    window.scroll({ top: 0, behavior: 'smooth' });

    if (router.query.ref) {
      await router.replace('/', '/', { shallow: true }); // removes url query params
    }
  };

  return (
    <div
      ref={scrollTopRef}
      className="fixed bottom-0 right-0 z-20 grid h-20 w-20 place-items-center transition-opacity duration-150 ease-in"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <button
        type="button"
        aria-label="Zum Seitenanfang scrollen"
        className="transition-transform duration-200 ease-in"
        onClick={handleClick}
        style={{
          transform: isAtBottom ? `translateY(-100%)` : `translateY(0px)`,
        }}
      >
        <AiOutlineArrowUp size={32} />
      </button>
    </div>
  );
}
