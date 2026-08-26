# Heading Tool

![Version of EditorJS that the plugin is compatible with](https://badgen.net/badge/Editor.js/v2.0/blue)

Provides Headings Blocks for the [Editor.js](https://ifmo.su/editor).

## Installation

Get the package

```shell
yarn add @editorjs/header
```

Include module at your application

```javascript
import { Header } from '@editorjs/header';
```

Optionally, you can load this tool from CDN [JsDelivr CDN](https://cdn.jsdelivr.net/npm/@editorjs/header@latest)

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    header: Header,
  },

  ...
});
```

## Shortcut

You can insert this Block by a useful shortcut. Set it up with the `tools[].shortcut` property of the Editor's initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    header: {
      class: Header,
      shortcut: 'CMD+SHIFT+H',
    },
  },

  ...
});
```

## Config Params

All properties are optional.

| Field        | Type       | Description                 |
| ------------ | ---------- | --------------------------- |
| placeholder  | `string`   | header's placeholder string |
| levels       | `number[]` | enabled heading levels      |
| defaultLevel | `number`   | default heading level       |

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    header: {
      class: Header,
      config: {
        placeholder: 'Enter a header',
        levels: [2, 3, 4],
        defaultLevel: 3
      }
    }
  }

  ...
});
```

## Tool's settings

![An image showing the header block tool](https://capella.pics/634ad545-08d7-4cb7-8409-f01289e0e5e1.jpg)

You can select one of six levels for heading.

## Output data

| Field | Type                 | Description                                      |
| ----- | -------------------- | ------------------------------------------------ |
| text  | `TextNodeSerialized`  | header's text, with inline formatting fragments  |
| level | `number`              | level of header: 1 for H1, 2 for H2 ... 6 for H6 |

```json
{
  "type": "header",
  "data": {
    "text": { "value": "Why Telegram is the best messenger", "fragments": [] },
    "level": 2
  }
}
```

## TODO

This package depends on `@editorjs/model`, `@editorjs/sdk`, and `@editorjs/dom-adapters` via `workspace:^`, and is meant to be developed, built, and tested only inside the [`document-model`](https://github.com/editor-js/document-model) workspace (as a git submodule under `packages/tools/header`) — it isn't installable or buildable standalone right now. `yarn install` in this repo alone will fail with a "Workspace not found" error.

Publishing `@editorjs/header` to npm will happen through `document-model`'s own release pipeline once the submodule is wired in, not through this repository's own CI.
