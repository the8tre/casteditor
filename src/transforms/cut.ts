import type { CastDocument, TimeRange } from '../types/asciicast';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function applyCut(doc: CastDocument, range: TimeRange): CastDocument {
  const gapDuration = range.end - range.start;
  const events = doc.events
    .filter(e => e.time < range.start || e.time > range.end)
    .map(e => {
      if (e.time > range.end) {
        return { ...e, time: r3(e.time - gapDuration) };
      }
      return e;
    });

  return { header: { ...doc.header }, events };
}
