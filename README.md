# Cast/edit/or

A browser-based editor for [asciinema](https://asciinema.org/) recordings (`.cast` files).
100% client-side — no server, no uploads, your files never leave the browser.

Give a try to the live app here: https://the8tre.github.io/casteditor/

## Features

- **Trim** — keep only a time range
- **Cut** — remove a time range
- **Speed** — change playback speed globally or within a selection
- **Remove Idle** — cap long pauses to a maximum gap
- **Add Idle** — insert a pause of chosen duration at the playhead position
- **Normalize Input** — even out keystroke timing (recorded with `--stdin` option)
- **Resize** — change terminal dimensions
- **Replace Text** — find and replace text in output events
- **Undo / Redo** — full history (Ctrl+Z / Ctrl+Y)
- **Export** — download the edited `.cast` file

## Create your own casts
- `brew install asciinema`
- Follow the directions here: https://docs.asciinema.org/getting-started/
- Format must be `asciicast-v2`
- Be sure to use the `--stdin` option if you want the user input to be captured and be able to use the Normalize Input feature
- Example: `asciinema record --output-format asciicast-v2 --overwrite --stdin my_nice.cast`

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

- [React 19](https://react.dev/)
- [MUI v5](https://mui.com/)
- [Vite 5](https://vitejs.dev/)
- [asciinema-player v3](https://github.com/asciinema/asciinema-player)
- TypeScript
