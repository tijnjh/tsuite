/**
 * Attempts to load an image via fetch and sets it as a data URL on the given <img> element.
 *
 * This approach allows you to:
 *   - Detect HTTP errors (e.g., 404, 500) before setting the image source.
 *   - Run custom fallback logic (function or alternate image URL) if loading fails.
 *
 * ⚠️ **Trade-offs:**
 *   - Bypasses browser image caching and progressive rendering.
 *   - May increase memory usage (images are loaded as data URLs).
 *   - Can encounter CORS issues more often than using <img src>.
 *   - Slightly more complex than using the standard <img onerror> handler.
 *
 * **When to use:**
 *   - You need to distinguish between different HTTP errors.
 *   - You want to run custom logic before the image is rendered.
 *   - You need to preprocess the image data.
 *
 * **For most cases, prefer using the <img> element's onerror handler for better performance and simplicity.**
 *
 * @param imageElement The target <img> element.
 * @param {string} src The preferred image source URL.
 * @param {Function|string} fallback What to do when loading the preferred source fails.
 *        Can be either a function (called with (img, error)) or a different image source URL.
 */
export default function (
  imageElement: HTMLImageElement,
  src: string,
  fallback: Function | string,
) {
  fetch(src)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;
        imageElement.src = String(e.target.result);
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      if (typeof fallback === "function") {
        fallback(imageElement, error);
      } else if (typeof fallback === "string") {
        imageElement.src = fallback;
      }
    });
}
