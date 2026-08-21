import { describe, it, expect } from 'vitest';
import { applyTrim } from '../trim';
import type { CastDocument } from '../../types/asciicast';

function makeDoc(times: number[]): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24, duration: times[times.length - 1] ?? 0 },
    events: times.map((t, i) => ({ id: String(i), time: t, type: 'o', data: `e${i}` })),
  };
}

describe('applyTrim', () => {
  it('keeps only events within [inPoint, outPoint]', () => {
    const doc = makeDoc([0, 1, 2, 3, 4]);
    const result = applyTrim(doc, 1, 3);
    expect(result.events).toHaveLength(3);
  });

  it('re-zeros event times to start at 0', () => {
    const doc = makeDoc([0, 1, 2, 3, 4]);
    const result = applyTrim(doc, 1, 3);
    expect(result.events.map(e => e.time)).toEqual([0, 1, 2]);
  });

  it('sets header.duration to outPoint - inPoint', () => {
    const doc = makeDoc([0, 1, 2, 3, 4]);
    const result = applyTrim(doc, 1, 3);
    expect(result.header.duration).toBe(2);
  });

  it('returns empty events when range contains nothing', () => {
    const doc = makeDoc([0, 5]);
    const result = applyTrim(doc, 2, 3);
    expect(result.events).toHaveLength(0);
  });
});
