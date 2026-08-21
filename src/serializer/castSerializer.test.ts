import { describe, it, expect } from 'vitest';
import { serializeCast } from './castSerializer';
import type { CastDocument } from '../types/asciicast';

function makeDoc(times: number[]): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24, title: 'test' },
    events: times.map((t, i) => ({ id: String(i), time: t, type: 'o', data: `e${i}` })),
  };
}

describe('serializeCast', () => {
  it('first line is the header as JSON', () => {
    const doc = makeDoc([1, 2]);
    const lines = serializeCast(doc).split('\n').filter(Boolean);
    const header = JSON.parse(lines[0]);
    expect(header.version).toBe(2);
    expect(header.width).toBe(80);
    expect(header.title).toBe('test');
  });

  it('recalculates duration as max event time', () => {
    const doc = makeDoc([1, 3, 2]); // unsorted to confirm max, not last
    const lines = serializeCast(doc).split('\n').filter(Boolean);
    const header = JSON.parse(lines[0]);
    expect(header.duration).toBe(3);
  });

  it('serializes events as [time, type, data] arrays', () => {
    const doc = makeDoc([1, 2]);
    const lines = serializeCast(doc).split('\n').filter(Boolean);
    const event = JSON.parse(lines[1]);
    expect(event).toEqual([1, 'o', 'e0']);
  });

  it('strips internal id field from events', () => {
    const doc = makeDoc([1]);
    const lines = serializeCast(doc).split('\n').filter(Boolean);
    const event = JSON.parse(lines[1]);
    expect(event).toHaveLength(3); // [time, type, data] only
  });

  it('sets duration to 0 for empty events', () => {
    const doc: CastDocument = { header: { version: 2, width: 80, height: 24 }, events: [] };
    const lines = serializeCast(doc).split('\n').filter(Boolean);
    const header = JSON.parse(lines[0]);
    expect(header.duration).toBe(0);
  });

  it('handles large event arrays without stack overflow', () => {
    const times = Array.from({ length: 150_000 }, (_, i) => i * 0.01);
    const doc = makeDoc(times);
    expect(() => serializeCast(doc)).not.toThrow();
    const lines = serializeCast(doc).split('\n').filter(Boolean);
    const header = JSON.parse(lines[0]);
    expect(header.duration).toBeCloseTo(1499.99, 1);
  });

  it('ends with a trailing newline', () => {
    const doc = makeDoc([1]);
    expect(serializeCast(doc).endsWith('\n')).toBe(true);
  });
});
