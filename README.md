# PyVisualize

🔗 **Live demo:** https://vnaveen0928.github.io/pyvisualize/

Learn Python from absolute basics to advanced topics through plain-English explanations, interactive step-through diagrams, and a live in-browser Python playground (powered by [Pyodide](https://pyodide.org) — real CPython compiled to WebAssembly, no server required).

**46 topics**, grouped Basics → Intermediate → Advanced, each with:

1. A plain-English explanation with an everyday analogy
2. An interactive, step-controlled visual diagram tailored to that concept
3. A short, heavily-commented code example
4. A live playground — edit the code and click **Run** to execute real Python in your browser
5. A "Try it yourself" challenge with a collapsible hint and solution
6. Common mistakes / gotchas

## Running it

No build step, no install, no server required. `index.html` is fully self-contained (all app code and styles are inlined into it) — just double-click it, or open it with File → Open in your browser, and it works.

If you'd rather serve it (e.g. for a cleaner local URL), that works too:

```bash
cd pyvisualize
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Either way, `index.html` still loads React, Tailwind, Prism, Babel, and Pyodide from public CDNs, so you do need an internet connection the first time you open it (after that, your browser caches them).

The first time you click **Run** in any playground, it downloads the Python runtime (~10–20s, then cached for the rest of the session) — everything after that runs instantly, fully offline in your browser tab.

## Tech stack

- React 18 (functional components + hooks), loaded via CDN, no bundler
- Tailwind CSS (via the Play CDN)
- Prism.js for syntax highlighting
- Pyodide for the live Python playground
- Hand-built step-controlled SVG/CSS diagrams (no animation library — every animation has explicit step-forward/back controls, never autoplay)

## File structure

```
index.html                    everything: CDN includes + all app code, inlined
styles.css                    source copy of the custom CSS (also inlined into index.html)
src/topics-basics.js          15 Basics topics (data)
src/topics-intermediate.js    15 Intermediate topics (data)
src/topics-advanced.js        16 Advanced topics (data)
src/diagrams.js               the diagram engine — 13 reusable renderer types
src/playground.js             the live Pyodide-powered code editor + runner
src/app.js                    sidebar, search, progress bar, topic panel, routing
```

`index.html` is the file that actually runs — it has the full contents of every `src/*.js` file (and `styles.css`) inlined directly into it, so opening it needs nothing else. Babel Standalone transpiles the inlined JSX right in the browser, so there's still no build step.

The `src/*.js` files are kept as the readable, editable source. If you change one, re-inline it into `index.html` (open the file, find its `<script type="text/babel">` block, and paste in the updated contents) so your edit actually takes effect — `index.html` doesn't read `src/*.js` at runtime.

## Adding a topic

Every topic is a plain JS object (see any entry in `src/topics-*.js` for the shape). Diagrams are pure data — pick one of the 13 `diagram.type`s in `src/diagrams.js` (`box`, `sequence`, `trace`, `stack`, `tree`, `pull`, `wrap`, `backpack`, `timeline`, `key`, `heap`, `flow`, `regex`) and supply a `steps` array; the renderer and step controls come for free.
