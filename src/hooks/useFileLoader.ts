import { useCallback } from 'react';
import { parseCast } from '../parser/castParser';
import { useEditor } from '../state/documentStore';

export function useFileLoader() {
  const { dispatch } = useEditor();

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const document = parseCast(text);
        dispatch({ type: 'LOAD_FILE', payload: { document, filename: file.name } });
      } catch (err) {
        alert(`Failed to parse file: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    reader.readAsText(file);
  }, [dispatch]);

  return { loadFile };
}
