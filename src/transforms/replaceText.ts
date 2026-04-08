import type { CastDocument } from '../types/asciicast';

function toRegex(search: string, glob: boolean): RegExp {
  if (glob) {
    const pattern = search.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
    return new RegExp(pattern, 'g');
  }
  return new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
}

export function applyReplaceText(doc: CastDocument, search: string, replacement: string, glob = false): CastDocument {
  const re = toRegex(search, glob);
  const events = doc.events.map(e => {
    if (e.type !== 'o') return e;
    const replaced = e.data.replace(re, replacement);
    return replaced !== e.data ? { ...e, data: replaced } : e;
  });
  return { header: { ...doc.header }, events };
}

export function countMatches(doc: CastDocument, search: string, glob = false): number {
  if (!search) return 0;
  const re = toRegex(search, glob);
  let count = 0;
  for (const e of doc.events) {
    if (e.type !== 'o') continue;
    const matches = e.data.match(re);
    if (matches) count += matches.length;
  }
  return count;
}
