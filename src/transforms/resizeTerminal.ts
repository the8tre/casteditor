import type { CastDocument } from '../types/asciicast';

// Matches ANSI escape sequences (CSI, OSC, lone ESC, etc.)
const ANSI_RE = /(\x1b\[[0-9;]*[A-Za-z]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[^[\]])/g;

/**
 * Split `data` into logical lines as a terminal would, honouring \r\n and \n,
 * then truncate each line that exceeds `maxCols` visible characters.
 * Truncated lines get an ellipsis (…) appended as the last visible character.
 * ANSI escape sequences are preserved and do not count toward the visible width.
 */
function truncateLines(data: string, maxCols: number): string {
  // Split on newline boundaries while keeping the delimiters
  const segments = data.split(/(\r?\n|\r)/);
  const result: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    // Delimiter segments — pass through as-is
    if (/^(\r?\n|\r)$/.test(seg)) {
      result.push(seg);
      continue;
    }

    // Walk the segment character-by-character, skipping escape sequences
    let visibleCols = 0;
    let out = '';
    let pos = 0;

    while (pos < seg.length) {
      // Check for an ANSI escape starting here
      ANSI_RE.lastIndex = pos;
      const m = ANSI_RE.exec(seg);
      if (m && m.index === pos) {
        out += m[0];
        pos += m[0].length;
        continue;
      }

      if (visibleCols >= maxCols - 1) {
        // We're at the last allowed column — check whether there are more
        // visible characters remaining after skipping any escapes
        let hasMore = false;
        let peek = pos;
        while (peek < seg.length) {
          ANSI_RE.lastIndex = peek;
          const pm = ANSI_RE.exec(seg);
          if (pm && pm.index === peek) { peek += pm[0].length; continue; }
          hasMore = true;
          break;
        }
        if (hasMore) {
          out += '…';
          // Consume the rest, but still emit any trailing escape sequences
          // so terminal state isn't corrupted (e.g. colour resets)
          while (pos < seg.length) {
            ANSI_RE.lastIndex = pos;
            const rm = ANSI_RE.exec(seg);
            if (rm && rm.index === pos) { out += rm[0]; pos += rm[0].length; }
            else { pos++; } // skip visible char
          }
        } else {
          out += seg[pos++];
        }
        break;
      }

      out += seg[pos++];
      visibleCols++;
    }

    result.push(out);
  }

  return result.join('');
}

export function applyResize(
  doc: CastDocument,
  width: number,
  height: number,
  truncate = false,
): CastDocument {
  const events = truncate
    ? doc.events.map(e =>
        e.type === 'o' ? { ...e, data: truncateLines(e.data, width) } : e,
      )
    : doc.events;

  return {
    header: { ...doc.header, width, height },
    events,
  };
}
