import type { CastDocument } from '../types/asciicast';

export function addIdle(doc: CastDocument, atTime: number, duration: number): CastDocument {
  const events = doc.events.map(e =>
    e.time >= atTime ? { ...e, time: e.time + duration } : e
  );
  const originalDuration =
    doc.header.duration ??
    (doc.events.length > 0 ? doc.events[doc.events.length - 1].time : 0);
  return {
    header: {
      ...doc.header,
      duration: originalDuration + duration,
    },
    events,
  };
}
