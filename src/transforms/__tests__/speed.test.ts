import { describe, it, expect } from 'vitest';
import { applySpeed } from '../speed';
import type { CastDocument } from '../../types/asciicast';

function makeDoc(times: number[]): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24, duration: times[times.length - 1] ?? 0 },
    events: times.map((t, i) => ({ id: String(i), time: t, type: 'o', data: `e${i}` })),
  };
}

describe('applySpeed — global', () => {
  it('halves all times at 2x speed', () => {
    const doc = makeDoc([0, 2, 4, 6]);
    const result = applySpeed(doc, 2);
    expect(result.events.map(e => e.time)).toEqual([0, 1, 2, 3]);
  });

  it('doubles all times at 0.5x speed', () => {
    const doc = makeDoc([0, 1, 2]);
    const result = applySpeed(doc, 0.5);
    expect(result.events.map(e => e.time)).toEqual([0, 2, 4]);
  });

  it('updates header.duration', () => {
    const doc = makeDoc([0, 2, 4]);
    const result = applySpeed(doc, 2);
    expect(result.header.duration).toBe(2);
  });
});

describe('applySpeed — range', () => {
  it('rescales events inside range', () => {
    const doc = makeDoc([0, 1, 2, 3, 4]);
    // 2x speed in [1, 3]: offset 0→0, 0.5→0.5, 1→1 (relative)
    const result = applySpeed(doc, 2, { start: 1, end: 3 });
    const times = result.events.map(e => e.time);
    expect(times[0]).toBe(0);         // before range: unchanged
    expect(times[1]).toBe(1);         // at range.start: unchanged
    expect(times[2]).toBeCloseTo(1.5); // 1 + (2-1)/2
    expect(times[3]).toBeCloseTo(2);  // 1 + (3-1)/2
  });

  it('shifts post-range events by delta', () => {
    const doc = makeDoc([0, 1, 2, 3, 5]);
    const result = applySpeed(doc, 2, { start: 1, end: 3 });
    // segment 1-3 becomes 1-2 (delta = -1), so event at 5 → 4
    expect(result.events[4].time).toBeCloseTo(4);
  });

  it('updates header.duration', () => {
    const doc = makeDoc([0, 1, 2, 3, 4]);
    const result = applySpeed(doc, 2, { start: 1, end: 3 });
    expect(result.header.duration).toBeCloseTo(3);
  });
});
