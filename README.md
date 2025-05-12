# tsuite

## /swiːt/ &mdash; _suite_

> **noun**  
> _a number of things forming a series or set._

A collection of useful utility functions, All fully typed and documented

![GitHub last commit](https://img.shields.io/github/last-commit/tijnjh/tsuite)
[![npm version](https://img.shields.io/npm/v/tsuite.svg)](https://npmjs.com/package/tsuite)
![NPM Downloads](https://img.shields.io/npm/dm/tsuite)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/tsuite)
![docs](https://img.shields.io/badge/view_the_docs-blue)

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
import { tryCatch } from "tsuite";
// or
import tryCatch from "tsuite/try-catch";
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

### docs: https://tijnjh.github.io/tsuite

## Contributing

If you have a utility you think fits tsuite, feel free to open an issue or pull request.
