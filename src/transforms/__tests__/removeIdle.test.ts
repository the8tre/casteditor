import { describe, it, expect } from 'vitest';
import { applyRemoveIdle } from '../removeIdle';
import type { CastDocument } from '../../types/asciicast';

function makeDoc(times: number[]): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24, duration: times[times.length - 1] ?? 0 },
    events: times.map((t, i) => ({ id: String(i), time: t, type: 'o', data: `e${i}` })),
  };
}

describe('applyRemoveIdle', () => {
  it('returns unchanged doc when no events', () => {
    const doc: CastDocument = { header: { version: 2, width: 80, height: 24 }, events: [] };
    expect(applyRemoveIdle(doc, 1)).toBe(doc);
  });

  it('collapses gaps above threshold to threshold', () => {
    // gap between 0 and 5 = 5; threshold = 1 → collapse 4 seconds
    const doc = makeDoc([0, 5, 6]);
    const result = applyRemoveIdle(doc, 1);
    expect(result.events[0].time).toBe(0);
    expect(result.events[1].time).toBeCloseTo(1);
    expect(result.events[2].time).toBeCloseTo(2);
  });

  it('does not touch gaps below threshold', () => {
    const doc = makeDoc([0, 0.5, 1]);
    const result = applyRemoveIdle(doc, 2);
    expect(result.events.map(e => e.time)).toEqual([0, 0.5, 1]);
  });

  it('updates header.duration', () => {
    const doc = makeDoc([0, 5, 6]);
    const result = applyRemoveIdle(doc, 1);
    expect(result.header.duration).toBeCloseTo(2);
  });

  it('handles multiple idle gaps', () => {
    const doc = makeDoc([0, 10, 20]);
    const result = applyRemoveIdle(doc, 1);
    expect(result.events[1].time).toBeCloseTo(1);
    expect(result.events[2].time).toBeCloseTo(2);
  });
});
