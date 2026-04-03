# CastEditor

A browser-based editor for [asciinema](https://asciinema.org/) recordings (`.cast` files).
100% client-side — no server, no uploads, your files never leave the browser.

## Features

- **Trim** — keep only a time range
- **Cut** — remove a time range
- **Speed** — change playback speed globally or within a selection
- **Remove Idle** — cap long pauses to a maximum gap
- **Normalize Input** — even out keystroke timing
- **Resize** — change terminal dimensions
- **Replace Text** — find and replace text in output events
- **Undo / Redo** — full history (Ctrl+Z / Ctrl+Y)
- **Export** — download the edited `.cast` file

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173, then drag and drop a `.cast` file onto the page.

## Build

```bash
npm run build   # outputs to dist/
```

## Stack

- [React 18](https://react.dev/)
- [MUI v5](https://mui.com/)
- [Vite 5](https://vitejs.dev/)
- [asciinema-player v3](https://github.com/asciinema/asciinema-player)
- TypeScript
