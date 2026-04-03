import type { CastDocument } from '../types/asciicast';

export function serializeCast(doc: CastDocument): string {
  const lastEventTime = doc.events.length > 0
    ? doc.events[doc.events.length - 1].time
    : 0;

  const header = { ...doc.header, duration: lastEventTime };
  const lines: string[] = [JSON.stringify(header)];

  for (const event of doc.events) {
    lines.push(JSON.stringify([event.time, event.type, event.data]));
  }

  return lines.join('\n') + '\n';
}
