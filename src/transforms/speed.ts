import type { CastDocument, TimeRange } from '../types/asciicast';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function applySpeed(doc: CastDocument, multiplier: number, range?: TimeRange): CastDocument {
  if (!range) {
    // Global speed change
    const events = doc.events.map(e => ({ ...e, time: r3(e.time / multiplier) }));
    return { header: { ...doc.header }, events };
  }

  // Per-range: rescale inside [range.start, range.end], shift after by delta
  const segmentDuration = range.end - range.start;
  const newSegmentDuration = segmentDuration / multiplier;
  const delta = newSegmentDuration - segmentDuration;

  const events = doc.events.map(e => {
    if (e.time < range.start) return e;
    if (e.time <= range.end) {
      const offsetInSegment = e.time - range.start;
      return { ...e, time: r3(range.start + offsetInSegment / multiplier) };
    }
    return { ...e, time: r3(e.time + delta) };
  });

  return { header: { ...doc.header }, events };
}
