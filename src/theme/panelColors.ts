import type { PanelId } from '../types/asciicast';

export const PANEL_COLORS: Record<string, { r: number; g: number; b: number }> = {
  trim:           { r: 255, g: 152, b:   0 },
  cut:            { r: 244, g:  67, b:  54 },
  speed:          { r: 156, g:  39, b: 176 },
  removeIdle:     { r:   0, g: 188, b: 212 },
  addIdle:        { r: 105, g: 240, b: 174 },
  normalizeInput: { r:  33, g: 150, b: 243 },
  resize:         { r:  76, g: 175, b:  80 },
  replaceText:    { r: 255, g: 235, b:  59 },
};
export const DEFAULT_COLOR = { r: 33, g: 150, b: 243 };

export function getPanelColor(panel: PanelId | null) {
  return panel ? (PANEL_COLORS[panel] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
}

export const EVENT_COLORS: Record<string, string> = {
  o: '#4caf50',
  i: '#2196f3',
  r: '#ff9800',
  m: '#9c27b0',
};

export const EVENT_LABELS: Record<string, string> = {
  o: 'Output',
  i: 'Input',
  r: 'Resize',
  m: 'Marker',
};
