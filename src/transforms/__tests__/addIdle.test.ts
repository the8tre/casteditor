import { describe, it, expect } from 'vitest';
import { addIdle } from '../addIdle';
import type { CastDocument } from '../../types/asciicast';

function makeDoc(times: number[], duration?: number): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24, duration },
    events: times.map((t, i) => ({ id: String(i), time: t, type: 'o', data: `e${i}` })),
  };
}

describe('addIdle', () => {
  it('shifts events at or after atTime forward by duration', () => {
    const doc = makeDoc([0, 1, 2, 3]);
    const result = addIdle(doc, 2, 1);
    expect(result.events.map(e => e.time)).toEqual([0, 1, 3, 4]);
  });

  it('does not touch events before atTime', () => {
    const doc = makeDoc([0, 1, 2]);
    const result = addIdle(doc, 2, 5);
    expect(result.events[0].time).toBe(0);
    expect(result.events[1].time).toBe(1);
  });

  it('updates header.duration using existing header.duration as base', () => {
    const doc = makeDoc([0, 1, 2], 5);
    const result = addIdle(doc, 2, 3);
    expect(result.header.duration).toBe(8);
  });

  it('updates header.duration using last event time when header.duration absent', () => {
    const doc = makeDoc([0, 1, 4]);
    const result = addIdle(doc, 2, 2);
    expect(result.header.duration).toBe(6);
  });
});
