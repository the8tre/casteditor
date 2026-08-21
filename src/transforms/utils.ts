import type { CastDocument } from '../types/asciicast';

export function recalcDuration(doc: CastDocument): CastDocument {
  const duration = doc.events.length > 0
    ? doc.events.reduce((max, e) => e.time > max ? e.time : max, 0)
    : 0;
  return { ...doc, header: { ...doc.header, duration } };
}
