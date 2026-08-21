import { describe, it, expect } from 'vitest';
import { applyReplaceText, countMatches } from '../replaceText';
import type { CastDocument } from '../../types/asciicast';

function makeDoc(outputs: string[]): CastDocument {
  return {
    header: { version: 2, width: 80, height: 24 },
    events: outputs.map((data, i) => ({ id: String(i), time: i, type: 'o', data })),
  };
}

describe('applyReplaceText — plain', () => {
  it('replaces exact match in output events', () => {
    const doc = makeDoc(['hello world', 'hello again']);
    const result = applyReplaceText(doc, 'hello', 'hi');
    expect(result.events[0].data).toBe('hi world');
    expect(result.events[1].data).toBe('hi again');
  });

  it('escapes regex special chars in search string', () => {
    const doc = makeDoc(['price: $10.00']);
    const result = applyReplaceText(doc, '$10.00', '$9.99');
    expect(result.events[0].data).toBe('price: $9.99');
  });

  it('does not touch non-output events', () => {
    const doc: CastDocument = {
      header: { version: 2, width: 80, height: 24 },
      events: [{ id: '0', time: 0, type: 'i', data: 'hello' }],
    };
    const result = applyReplaceText(doc, 'hello', 'hi');
    expect(result.events[0].data).toBe('hello');
  });
});

describe('applyReplaceText — glob', () => {
  it('* matches any substring', () => {
    const doc = makeDoc(['foobar', 'foobaz']);
    const result = applyReplaceText(doc, 'foo*', 'X', true);
    expect(result.events[0].data).toBe('X');
    expect(result.events[1].data).toBe('X');
  });

  it('? matches single character', () => {
    // '?at' glob → regex '.at' (global); matches 3-char sequences ending in 'at'
    // 'cat' → 'X', 'bat' → 'X', 'flat' → 'f' + match('lat') → 'fX'
    const doc = makeDoc(['cat', 'bat', 'flat']);
    const result = applyReplaceText(doc, '?at', 'X', true);
    expect(result.events[0].data).toBe('X');
    expect(result.events[1].data).toBe('X');
    expect(result.events[2].data).toBe('fX');
  });
});

describe('countMatches', () => {
  it('counts occurrences across all output events', () => {
    const doc = makeDoc(['ab ab', 'ab']);
    expect(countMatches(doc, 'ab')).toBe(3);
  });

  it('returns 0 for empty search', () => {
    const doc = makeDoc(['hello']);
    expect(countMatches(doc, '')).toBe(0);
  });

  it('ignores non-output events', () => {
    const doc: CastDocument = {
      header: { version: 2, width: 80, height: 24 },
      events: [{ id: '0', time: 0, type: 'i', data: 'hello' }],
    };
    expect(countMatches(doc, 'hello')).toBe(0);
  });
});
