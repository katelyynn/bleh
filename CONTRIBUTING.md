# Contributing to bleh

### Rules

- Don't use AI
- Format your code using `deno fmt`
- Include a screenshot for UI changes
- Use [conventional commits](https://conventionalcommits.org/)

### Prerequisites

- [Deno](https://deno.com/)
- A userscript loader -- [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) is preferred
- A code editor which supports Deno's formatter and linter -- [Zed](https://zed.dev/) is preferred

### Development

Clone this repo and install dependencies:

```sh
git clone https://github.com/katelyynn/bleh.git
cd bleh/fm
deno install
```

Run `deno task dev`, then open [`http://localhost:8000/bleh.user.js`](http://localhost:8000/bleh.user.js) and tick the _"Track external edits"_ option in the Violentmonkey tab.
This will reinstall and rebuild the userscript whenever you change anything in the codebase.
If you just want to build and install bleh once, you can run `deno task build` and open `fm/bleh.user.js` in your browser.
