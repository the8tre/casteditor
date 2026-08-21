import { describe, it, expect } from 'vitest';
import { applyCut } from '../cut';
import type { CastDocument } from '../../types/asciicast';

function makeDoc(times: number[]): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24, duration: times[times.length - 1] ?? 0 },
    events: times.map((t, i) => ({ id: String(i), time: t, type: 'o', data: `e${i}` })),
  };
}

describe('applyCut', () => {
  it('removes events strictly inside the range', () => {
    // start:1, end:3 → keeps time < 1 or time > 3 → keeps 0 and 4
    // 4 shifts back by gap (2) → 2
    const doc = makeDoc([0, 1, 2, 3, 4]);
    const result = applyCut(doc, { start: 1, end: 3 });
    expect(result.events.map(e => e.time)).toEqual([0, 2]);
  });

  it('shifts post-range events back by the gap duration', () => {
    const doc = makeDoc([0, 1, 4, 5]);
    const result = applyCut(doc, { start: 1, end: 3 });
    // gap = 2; events at 4 → 2, 5 → 3
    expect(result.events.map(e => e.time)).toEqual([0, 2, 3]);
  });

  it('updates header.duration after cut', () => {
    const doc = makeDoc([0, 1, 4, 5]);
    const result = applyCut(doc, { start: 1, end: 3 });
    expect(result.header.duration).toBe(3);
  });

  it('returns empty events when everything is cut', () => {
    const doc = makeDoc([1, 2, 3]);
    const result = applyCut(doc, { start: 0, end: 4 });
    expect(result.events).toHaveLength(0);
    expect(result.header.duration).toBe(0);
  });

  it('preserves event data', () => {
    const doc = makeDoc([0, 5]);
    const result = applyCut(doc, { start: 1, end: 3 });
    expect(result.events[0].data).toBe('e0');
    expect(result.events[1].data).toBe('e1');
  });
});
