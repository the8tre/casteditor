import type { CastDocument, CastEvent, CastHeader, EventType } from '../types/asciicast';

export function parseCast(text: string): CastDocument {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  if (lines.length === 0) throw new Error('Empty file');

  const header = JSON.parse(lines[0]) as CastHeader;
  if (header.version !== 2) throw new Error(`Unsupported asciicast version: ${header.version}`);

  const events: CastEvent[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      const [time, type, data] = JSON.parse(line) as [number, string, string];
      events.push({
        id: crypto.randomUUID(),
        time,
        type: type as EventType,
        data,
      });
    } catch {
      // skip malformed lines
    }
  }

  return { header, events };
}
