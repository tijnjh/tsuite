import type { Properties } from "csstype";

type ElementAttributes<TagName extends keyof HTMLElementTagNameMap> = Omit<
  Partial<HTMLElementTagNameMap[TagName]>,
  "style"
> & {
  style?: Properties;
};

/**
 * Creates a new DOM node of the specified tag name, applies the given attributes,
 * and appends any provided child nodes.
 *
 * @template TagName The tag name of the HTML element to create.
 * @param tagName The tag name of the element to create (e.g., 'div', 'span').
 * @param attributes Optional attributes and styles to set on the element.
 *   - **Note:** The `style` attribute is overwritten to accept a CSS-in-JS object
 *     (from `csstype`) instead of a string. For example:
 *     `{ color: "red", fontWeight: "bold" }`
 * @param children Child nodes to append to the created element.
 * @returns The created HTML element.
 *
 * @example
 * const elDiv = createNode("div", {
 *   textContent: "Hello!",
 *   id: "myDiv",
 *   style: { color: "red", fontWeight: "bold" } // style is an object, not a string
 * });
 * document.body.append(elDiv);
 */
export default function createNode<TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
  attributes?: ElementAttributes<TagName>,
  ...children: Node[]
): HTMLElementTagNameMap[TagName] {
  const node = document.createElement(tagName);

  if (attributes) {
    if (attributes.style) {
      Object.assign(node.style, attributes.style);
    }
    const { style, ...rest } = attributes;
    Object.assign(node, rest);
  }

  for (const child of children) {
    node.append(child);
  }

  return node;
}
