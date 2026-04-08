import type { CastDocument, CastEvent } from '../types/asciicast';

const ANSI_RE = /^(\x1b\[[0-9;]*[A-Za-z]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[^[\]])/;

interface CursorState {
  col: number;
  truncatedLine: boolean;
}

function parseCsiCol(seq: string): number | null {
  const cha = /^\x1b\[([0-9]*)G$/.exec(seq);
  if (cha !== null) return Math.max(0, parseInt(cha[1] || '1', 10) - 1);
  const cup = /^\x1b\[([0-9]*);([0-9]*)H$/.exec(seq);
  if (cup !== null) return Math.max(0, parseInt(cup[2] || '1', 10) - 1);
  return null;
}

function truncateChunk(
  data: string,
  maxCols: number,
  state: CursorState,
): { out: string; state: CursorState } {
  let out = '';
  let { col, truncatedLine } = state;
  let pos = 0;

  while (pos < data.length) {
    const rest = data.slice(pos);
    const m = ANSI_RE.exec(rest);
    if (m !== null) {
      out += m[0];
      pos += m[0].length;
      const newCol = parseCsiCol(m[0]);
      if (newCol !== null) {
        col = newCol;
        if (col < maxCols) truncatedLine = false;
      }
      continue;
    }

    const ch = data[pos];
    if (ch === '\r') { out += ch; pos++; col = 0; truncatedLine = false; continue; }
    if (ch === '\n') { out += ch; pos++; col = 0; truncatedLine = false; continue; }

    // Visible character
    if (col < maxCols) {
      if (col === maxCols - 1) {
        // Peek ahead within this chunk for more visible chars
        let hasMore = false;
        let peek = pos + 1;
        while (peek < data.length) {
          const pm = ANSI_RE.exec(data.slice(peek));
          if (pm !== null) { peek += pm[0].length; continue; }
          if (data[peek] !== '\r' && data[peek] !== '\n') hasMore = true;
          break;
        }
        if (hasMore && !truncatedLine) { out += '…'; truncatedLine = true; }
        else { out += ch; }
      } else {
        out += ch;
      }
      col++;
    }
    // col >= maxCols: drop character (ellipsis already placed)
    pos++;
  }

  return { out, state: { col, truncatedLine } };
}

export function applyResize(
  doc: CastDocument,
  width: number,
  height: number,
  truncate = false,
): CastDocument {
  let events: CastEvent[];

  if (truncate) {
    const result: CastEvent[] = [];
    let state: CursorState = { col: 0, truncatedLine: false };
    for (const e of doc.events) {
      if (e.type === 'o') {
        const { out, state: next } = truncateChunk(e.data, width, state);
        state = next;
        result.push(out !== e.data ? { ...e, data: out } : e);
      } else {
        result.push(e);
      }
    }
    events = result;
  } else {
    events = doc.events;
  }

  return { header: { ...doc.header, width, height }, events };
}
