![](https://badgen.net/badge/CodeX%20Editor/v2.0/blue)

# Header Tool

Provides Headings Blocks for the [CodeX Editor](https://ifmo.su/editor).

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev codex.editor.header
```

Include module at your application

```javascript
const Header = require('codex.editor.header');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

Get newest bundle path from [RawGit](https://rawgit.com) — open site and paste link to JS bundle in repository.

`https://github.com/codex-editor/header/blob/master/dist/bundle.js`

> Note: use `production` link with commit hash to avoid issues with caching.

Then require this script on page with CodeX Editor.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the CodeX Editor initial config.

```javascript
var editor = CodexEditor({
  ...
  
  tools: {
    ...
    header: Header,
  }
  
  ...
});
```

## Shortcut

You can insert this Block by a useful shortcut. Set it up with the `tools[].shortcut` property of the Editor's initial config.

```javascript
var editor = CodexEditor({
  ...
  
  tools: {
    ...
    header: {
      class: Header,
      shortcut: 'CMD+SHIFT+H'
    }
  }
  
  ...
});
```

## Config Params

This Tool has no config params

## Tool's settings

![](https://capella.pics/5ef43c5b-441f-48bd-9b53-854f57f8161b.jpg)

You can select one of three levels for heading.

## Output data

| Field  | Type     | Description                                   |
| ------ | -------- | --------------------------------------------- |
| text   | `string` | header's text                                 |
| level  | `number` | level of header: 2 for H2, 3 for H3, 4 for H4 |


```json
{
    "type" : "header",
    "data" : {
        "text" : "Why Telegram is the best messenger",
        "level" : 2
    }
}
```

