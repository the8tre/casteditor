import type { CastDocument, CastEvent } from '../types/asciicast';

/**
 * Re-times 'i' (stdin) events within each segment to evenly-spaced intervals.
 * A segment is the sequence of 'i' events between two '\r' keypresses.
 * Non-'i' events are shifted by the same drift as the preceding 'i' event.
 */
export function applyNormalizeInput(doc: CastDocument, interval: number): CastDocument {
  const events = doc.events;
  const result: CastEvent[] = [];

  let drift = 0;
  let segmentAnchorTime = 0;  // shifted time of first 'i' in current segment
  let segmentPos = 0;          // how many 'i' events processed in current segment (0 = anchor)
  let inSegment = false;

  for (const ev of events) {
    if (ev.type !== 'i') {
      // Shift non-input events by current drift
      const newTime = Math.max(0, Math.round((ev.time + drift) * 1000) / 1000);
      result.push({ ...ev, time: newTime });
      continue;
    }

    // 'i' event
    if (!inSegment) {
      // First 'i' event in new segment — anchor here, drift unchanged
      segmentAnchorTime = ev.time + drift;
      segmentPos = 0;
      inSegment = true;
      result.push({ ...ev, time: Math.max(0, Math.round((ev.time + drift) * 1000) / 1000) });
    } else {
      // Subsequent 'i' event in segment
      segmentPos += 1;
      const newTime = Math.max(0, Math.round((segmentAnchorTime + segmentPos * interval) * 1000) / 1000);
      drift = newTime - ev.time;
      result.push({ ...ev, time: newTime });
    }

    // If this keystroke is Enter, end the segment
    if (ev.data === '\r') {
      inSegment = false;
      segmentPos = 0;
    }
  }

  return { ...doc, events: result.slice().sort((a, b) => a.time - b.time) };
}
