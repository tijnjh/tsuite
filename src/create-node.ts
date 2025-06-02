import type { Properties } from "csstype";

type ElementAttributes<TagName extends keyof HTMLElementTagNameMap> =
  & Omit<
    Partial<HTMLElementTagNameMap[TagName]>,
    "style"
  >
  & {
    style?: Properties | string;
  };

/**
 * Creates a new DOM node of the specified tag name, applies the given attributes,
 * and appends any provided child nodes.
 *
 * @template TagName The tag name of the HTML element to create.
 * @param tagName The tag name of the element to create (e.g., 'div', 'span').
 * @param attributes Optional attributes and styles to set on the element.
 *   - All standard element properties are supported.
 *   - The `style` attribute can be:
 *     - a **CSS-in-JS object** (from `csstype`), e.g. `{ color: "red", fontWeight: "bold" }`
 *       - This provides autocomplete and strict type checking.
 *     - a **string** (as in standard DOM usage), e.g. `"color: red; font-weight: bold;"`
 *       - This does **not** provide autocomplete or type checking.
 * @param children Child nodes to append to the created element.
 * @returns The created HTML element.
 *
 * @example
 * // Using a CSS-in-JS object for style (type-safe, with autocomplete)
 * const el1 = createNode("div", {
 *   textContent: "Hello!",
 *   style: { color: "red", fontWeight: "bold" }
 * });
 *
 * // Using a string for style (no type safety or autocomplete)
 * const el2 = createNode("div", {
 *   textContent: "World!",
 *   style: "color: blue; font-weight: bold;"
 * });
 *
 * document.body.append(el1, el2);
 */
export function createNode<TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
  attributes?: ElementAttributes<TagName>,
  ...children: Node[]
): HTMLElementTagNameMap[TagName] {
  const node = document.createElement(tagName);

  if (attributes) {
    if (attributes.style) {
      if (typeof attributes.style === "object") {
        Object.assign(node.style, attributes.style);
      } else if (typeof attributes.style === "string") {
        node.style.cssText = attributes.style;
      }
    }
    const { style, ...rest } = attributes;
    Object.assign(node, rest);
  }

  for (const child of children) {
    node.append(child);
  }

  return node;
}
