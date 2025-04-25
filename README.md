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

### [Click here to view docs](https://tijnjh.github.io/tsuite)

## Contributing

If you have a utility you think fits tsuite, feel free to open an issue or pull request.
