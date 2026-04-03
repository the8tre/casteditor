import type { CastDocument } from '../types/asciicast';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function applyRemoveIdle(doc: CastDocument, threshold: number): CastDocument {
  if (doc.events.length === 0) return doc;

  const events = [...doc.events];
  let accumulatedOffset = 0;

  for (let i = 1; i < events.length; i++) {
    const currRaw = doc.events[i].time;
    const gap = currRaw - doc.events[i - 1].time;

    if (gap > threshold) {
      const saved = gap - threshold;
      accumulatedOffset -= saved;
    }

    events[i] = { ...events[i], time: r3(currRaw + accumulatedOffset) };
  }

  // Fix first event (should stay at its original time, adjusted by any offset from before)
  events[0] = { ...events[0], time: r3(doc.events[0].time) };

  return { header: { ...doc.header }, events };
}
