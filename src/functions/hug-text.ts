/**
 * Adjusts the width of a given element to fit its text content without increasing its height.
 *
 * @param  input - The element to adjust.
 */
/**
 * Shrinks the width of the given HTML element(s) until the text wraps to a new line,
 * then restores the width to the minimum value that fits the text on a single line.
 *
 * This function is useful for "hugging" text content by reducing the element's width
 * to the smallest possible value before the content overflows or wraps.
 *
 * @param input - The target element(s) to adjust. Accepts a single HTMLElement,
 *                a NodeList, an HTMLCollection, or an array of HTMLElements.
 * @throws {Error} If the input is not provided or is not a valid type.
 *
 * @example
 * ```typescript
 * const element = document.getElementById('my-text');
 * hugText(element);
 * ```
 */
export default function (
  input: HTMLElement | NodeList | HTMLCollection | HTMLElement[]
) {
  if (!input) {
    throw new Error("Input is required");
  }

  let elements = [];

  if (input instanceof Element) {
    elements = [input];
  } else if (input instanceof NodeList || input instanceof HTMLCollection) {
    elements = Array.from(input);
  } else if (Array.isArray(input)) {
    elements = input.filter((el) => el instanceof Element);
  } else {
    throw new Error(
      `Invalid input type. Expected Element, NodeList, HTMLCollection, or Array. got ${typeof input}`
    );
  }

  for (const element of elements) {
    const initialHeight = element.offsetHeight;
    const computedStyle = getComputedStyle(element);
    let currentWidth = parseFloat(computedStyle.width);

    while (currentWidth > 0) {
      currentWidth -= 1;
      element.style.width = `${currentWidth}px`;

      if (element.offsetHeight > initialHeight) {
        element.style.width = `${currentWidth + 1}px`;
        break;
      }
    }
  }
}
