# tsuite

## /swiːt/ &mdash; _suite_

> **noun**  
> _a number of things forming a series or set._

A collection of useful utility functions, All fully typed and documented

[![npm version](https://img.shields.io/npm/v/tsuite.svg)](https://npmjs.com/package/tsuite)

---

## Installation

```bash
npm i tsuite
```

---

## Usage

### In Node.js / Modern Bundlers

Import individual utilities for optimal tree-shaking:

```typescript
// TypeScript or modern JavaScript
import { tryCatch, mapElementsById } from "tsuite";

const [result, error] = tryCatch(() => JSON.parse('{"ok":1}'));
```

Or import the whole library (not recommended for tree-shaking):

```typescript
import * as tsuite from "tsuite";
```

---

### In the Browser

Include the bundle via a CDN or your local `node_modules`:

```html
<!-- From node_modules -->
<script src="/node_modules/tsuite/dist/index.global.js"></script>
<!-- Or from CDN -->
<script src="https://unpkg.com/tsuite/dist/index.global.js"></script>
```

Now access utilities from the global `tsuite` object:

```html
<script>
  const { elFoo, elBar } = tsuite.mapElementsById("foo", "bar");
</script>
```

---

## API

### mapElementsById

<details>
<summary>Click to view</summary>

Returns an object mapping each query string to the corresponding `HTMLElement` (or `null`) found by `id`.  
The object keys are in PascalCase and prefixed with `el`.

#### **Signature**

```typescript
mapElementsById(...queries: string[]): {
  [key: string]: HTMLElement | null;
}
```

#### **Example**

```typescript
import { mapElementsById } from "tsuite";

const { elFooBar, elBar } = mapElementsById("foo-bar", "baz");
// elFooBar -> HTMLElement | null (for id="foo-bar")
// elBaz    -> HTMLElement | null (for id="baz")
```

</details>

---

### hugText

<details>
<summary>Click to view</summary>

Shrinks the width of the given HTML element(s) until the text wraps to a new line,  
then restores the width to the minimum value that fits the text on a single line.

#### **Signature**

```typescript
hugText(
  input: HTMLElement | NodeList | HTMLCollection | HTMLElement[]
): void
```

#### **Example**

```typescript
import { hugText } from "tsuite";

const element = document.getElementById("my-text");
hugText(element);
```

</details>

---

### loadImageWithFallback

<details>
<summary>Click to view</summary>

Attempts to load an image via `fetch` and sets it as a data URL on the given `<img>` element.  
Allows you to detect HTTP errors and run custom fallback logic.

#### **Signature**

```typescript
loadImageWithFallback(
  imageElement: HTMLImageElement,
  src: string,
  fallback: ((img: HTMLImageElement, error: any) => void) | string
): void
```

#### **Example**

```typescript
import { loadImageWithFallback } from "tsuite";

const img = document.getElementById("my-img") as HTMLImageElement;

loadImageWithFallback(img, "https://example.com/image.png", (img, error) => {
  img.src = "/fallback.png";
  console.error("Image failed to load:", error);
});
```

</details>

---

### tryCatch

<details>
<summary>Click to view</summary>

A simple utility for handling sync or async errors.  
Returns a tuple: `[result, error]`.

#### **Signature**

```typescript
// For synchronous functions:
const [result, error] = tryCatch(() => doSomething());

// For promises:
const [result, error] = await tryCatch(somePromise);
```

#### **Example**

```typescript
import { tryCatch } from "tsuite";

// Synchronous
const [data, err] = tryCatch(() => JSON.parse('{"ok":1}'));

// Asynchronous
const [result, error] = await tryCatch(fetch("/api/data"));
```

</details>

---

### toast

<details>
<summary>Click to view</summary>

Displays a toast notification in the browser with a given message.
On non-browser environments, falls back to console.log.

#### **Signature**

```typescript
toast(message?: any): void
```

#### **Example**

```typescript
import { toast } from "tsuite";

// Display a simple message
toast("Hello World!");

// Display an object
toast({ status: "success", message: "Operation completed" });
```

</details>

---

## Contributing

If you have a utility you think fits tsuite, feel free to open an issue or pull request.
