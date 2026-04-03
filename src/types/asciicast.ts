export type EventType = 'o' | 'i' | 'r' | 'm';

export interface CastEvent {
  id: string;        // crypto.randomUUID(), assigned once at parse time
  time: number;      // seconds from recording start
  type: EventType;
  data: string;
}

export interface CastHeader {
  version: 2;
  width: number;
  height: number;
  title?: string;
  duration?: number;
  [key: string]: unknown;  // preserve unknown fields on round-trip
}

export interface CastDocument {
  header: CastHeader;
  events: CastEvent[];
}

export interface TimeRange { start: number; end: number; }

export type PanelId = 'trim' | 'cut' | 'speed' | 'removeIdle' | 'addIdle' | 'normalizeInput' | 'resize' | 'replaceText' | 'info';

export interface EditorState {
  document: CastDocument | null;
  filename: string | null;
  selection: TimeRange | null;
  playhead: number;
  activePanel: PanelId | null;
  past: CastDocument[];   // undo stack (capped at 50)
  future: CastDocument[];
}
