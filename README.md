# Header Tool

Header text blocks for [CodeX Editor](https://ifmo.su/editor).

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev codex.editor.header
```

Include module in your application

```javascript
const Header = require('codex.editor.header');
```

Include CSS file

```css
@import url("~codex.editor.header/dist/bundle.css");
```

### Load to your project's source dir

1. Download folder `dist` from repository
2. Add `dist/bundle.js` and `dist/bundle.css` files to your page.

### Load from CDN

You can get sources from [RawGit](https://rawgit.com) CDN.

To get the link paste paths to JS ans CSS files and get `production` links to the latest version of Tool.

Then require these link on page with CodeX Editor.
 
**JS**: `https://github.com/codex-editor/header/blob/master/dist/bundle.js`

```html
<script src="..."></script>
```

**CSS:** `https://github.com/codex-editor/header/blob/master/dist/bundle.css`

```html
<link rel="stylesheet" href="...">
```

## Usage

Add a new Tool to `tools` param for CodeX Editor initial config.

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

## Config Params

This Tool has no config params
