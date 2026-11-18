import { useEffect } from "react";

export function useSearchShortcut(onShortcut: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMacOS = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const modifierPressed = isMacOS
        ? event.metaKey && !event.ctrlKey
        : event.ctrlKey && !event.metaKey;

      if (
        modifierPressed &&
        !event.altKey &&
        !event.shiftKey &&
        (event.code === "KeyK" || event.key.toLowerCase() === "k")
      ) {
        event.preventDefault();
        onShortcut();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onShortcut]);
}
