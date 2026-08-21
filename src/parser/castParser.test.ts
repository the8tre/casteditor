import { describe, it, expect } from 'vitest';
import { parseCast } from './castParser';

function makeCast(events: unknown[] = []): string {
  const header = { version: 2, width: 80, height: 24 };
  return [JSON.stringify(header), ...events.map(e => JSON.stringify(e))].join('\n') + '\n';
}

describe('parseCast', () => {
  it('parses valid v2 NDJSON', () => {
    const text = makeCast([[1.0, 'o', 'hello'], [2.0, 'o', 'world']]);
    const doc = parseCast(text);
    expect(doc.header.version).toBe(2);
    expect(doc.events).toHaveLength(2);
    expect(doc.events[0].time).toBe(1.0);
    expect(doc.events[0].type).toBe('o');
    expect(doc.events[0].data).toBe('hello');
  });

  it('assigns unique ids to each event', () => {
    const text = makeCast([[1, 'o', 'a'], [2, 'o', 'b']]);
    const doc = parseCast(text);
    expect(doc.events[0].id).not.toBe(doc.events[1].id);
  });

  it('throws on empty input', () => {
    expect(() => parseCast('')).toThrow('Empty file');
  });

  it('throws on version !== 2', () => {
    const text = JSON.stringify({ version: 1, width: 80, height: 24 }) + '\n';
    expect(() => parseCast(text)).toThrow('Unsupported asciicast version: 1');
  });

  it('skips malformed event lines', () => {
    const header = JSON.stringify({ version: 2, width: 80, height: 24 });
    const text = [header, 'not json', '[1.0, "o", "ok"]'].join('\n');
    const doc = parseCast(text);
    expect(doc.events).toHaveLength(1);
    expect(doc.events[0].data).toBe('ok');
  });

  it('preserves header fields', () => {
    const header = { version: 2, width: 120, height: 40, title: 'my cast' };
    const text = JSON.stringify(header) + '\n';
    const doc = parseCast(text);
    expect(doc.header.width).toBe(120);
    expect(doc.header.height).toBe(40);
    expect(doc.header.title).toBe('my cast');
  });
});
