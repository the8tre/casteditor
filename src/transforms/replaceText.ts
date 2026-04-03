import type { CastDocument } from '../types/asciicast';

export function applyReplaceText(doc: CastDocument, search: string, replacement: string): CastDocument {
  const events = doc.events.map(e => {
    if (e.type !== 'o' || !e.data.includes(search)) return e;
    return { ...e, data: e.data.split(search).join(replacement) };
  });
  return { header: { ...doc.header }, events };
}

export function countMatches(doc: CastDocument, search: string): number {
  if (!search) return 0;
  let count = 0;
  for (const e of doc.events) {
    if (e.type !== 'o') continue;
    let pos = 0;
    while ((pos = e.data.indexOf(search, pos)) !== -1) {
      count++;
      pos += search.length;
    }
  }
  return count;
}
