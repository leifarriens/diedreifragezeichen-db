export function getIsMacOS() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}
