import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { EditorState, CastDocument } from '../types/asciicast';
import type { Action } from './actions';
import { applyTrim } from '../transforms/trim';
import { applyCut } from '../transforms/cut';
import { applySpeed } from '../transforms/speed';
import { applyRemoveIdle } from '../transforms/removeIdle';
import { applyResize } from '../transforms/resizeTerminal';
import { applyNormalizeInput } from '../transforms/normalizeInput';
import { applyReplaceText } from '../transforms/replaceText';
import { addIdle } from '../transforms/addIdle';

const MAX_UNDO = 50;

const initialState: EditorState = {
  document: null,
  filename: null,
  selection: null,
  playhead: 0,
  activePanel: null,
  past: [],
  future: [],
};

function pushUndo(past: CastDocument[], current: CastDocument): CastDocument[] {
  const next = [...past, current];
  return next.length > MAX_UNDO ? next.slice(next.length - MAX_UNDO) : next;
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'LOAD_FILE':
      return {
        ...initialState,
        document: action.payload.document,
        filename: action.payload.filename,
        activePanel: 'info',
      };

    case 'SET_SELECTION':
      return { ...state, selection: action.payload };

    case 'SET_PLAYHEAD':
      return { ...state, playhead: action.payload };

    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };

    case 'APPLY_TRIM': {
      if (!state.document) return state;
      const newDoc = applyTrim(state.document, action.payload.inPoint, action.payload.outPoint);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
        selection: null,
      };
    }

    case 'APPLY_CUT': {
      if (!state.document) return state;
      const newDoc = applyCut(state.document, action.payload);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
        selection: null,
      };
    }

    case 'APPLY_SPEED': {
      if (!state.document) return state;
      const newDoc = applySpeed(state.document, action.payload.multiplier, action.payload.range);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
      };
    }

    case 'APPLY_REMOVE_IDLE': {
      if (!state.document) return state;
      const newDoc = applyRemoveIdle(state.document, action.payload.threshold);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
      };
    }

    case 'APPLY_ADD_IDLE': {
      if (!state.document) return state;
      const newDoc = addIdle(state.document, action.payload.atTime, action.payload.duration);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
      };
    }

    case 'APPLY_RESIZE': {
      if (!state.document) return state;
      const newDoc = applyResize(state.document, action.payload.width, action.payload.height);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
      };
    }

    case 'APPLY_NORMALIZE_INPUT': {
      if (!state.document) return state;
      const newDoc = applyNormalizeInput(state.document, action.payload.interval);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
      };
    }

    case 'APPLY_REPLACE_TEXT': {
      if (!state.document) return state;
      const newDoc = applyReplaceText(state.document, action.payload.search, action.payload.replacement);
      return {
        ...state,
        document: newDoc,
        past: pushUndo(state.past, state.document),
        future: [],
      };
    }

    case 'UNDO': {
      if (state.past.length === 0 || !state.document) return state;
      const prev = state.past[state.past.length - 1];
      return {
        ...state,
        document: prev,
        past: state.past.slice(0, -1),
        future: [state.document, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0 || !state.document) return state;
      const next = state.future[0];
      return {
        ...state,
        document: next,
        past: pushUndo(state.past, state.document),
        future: state.future.slice(1),
      };
    }

    default:
      return state;
  }
}

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      } else if (e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      } else if (e.key === 'y') {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
