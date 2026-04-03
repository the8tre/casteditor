import type { CastDocument } from '../types/asciicast';

export function applyResize(doc: CastDocument, width: number, height: number): CastDocument {
  return {
    ...doc,
    header: { ...doc.header, width, height },
  };
}
