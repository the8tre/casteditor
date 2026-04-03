import type { CastDocument } from '../types/asciicast';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function applyTrim(doc: CastDocument, inPoint: number, outPoint: number): CastDocument {
  const events = doc.events
    .filter(e => e.time >= inPoint && e.time <= outPoint)
    .map(e => ({ ...e, time: r3(e.time - inPoint) }));

  return {
    header: { ...doc.header, duration: r3(outPoint - inPoint) },
    events,
  };
}
