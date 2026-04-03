import type { CastDocument, PanelId, TimeRange } from '../types/asciicast';

export type Action =
  | { type: 'LOAD_FILE'; payload: { document: CastDocument; filename: string } }
  | { type: 'SET_SELECTION'; payload: TimeRange | null }
  | { type: 'SET_PLAYHEAD'; payload: number }
  | { type: 'SET_ACTIVE_PANEL'; payload: PanelId | null }
  | { type: 'APPLY_TRIM'; payload: { inPoint: number; outPoint: number } }
  | { type: 'APPLY_CUT'; payload: TimeRange }
  | { type: 'APPLY_SPEED'; payload: { multiplier: number; range?: TimeRange } }
  | { type: 'APPLY_REMOVE_IDLE'; payload: { threshold: number } }
  | { type: 'APPLY_ADD_IDLE'; payload: { atTime: number; duration: number } }
  | { type: 'APPLY_RESIZE'; payload: { width: number; height: number } }
  | { type: 'APPLY_NORMALIZE_INPUT'; payload: { interval: number } }
  | { type: 'APPLY_REPLACE_TEXT'; payload: { search: string; replacement: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export const loadFile = (document: CastDocument, filename: string): Action =>
  ({ type: 'LOAD_FILE', payload: { document, filename } });

export const setSelection = (selection: TimeRange | null): Action =>
  ({ type: 'SET_SELECTION', payload: selection });

export const setPlayhead = (time: number): Action =>
  ({ type: 'SET_PLAYHEAD', payload: time });

export const setActivePanel = (panel: PanelId | null): Action =>
  ({ type: 'SET_ACTIVE_PANEL', payload: panel });
