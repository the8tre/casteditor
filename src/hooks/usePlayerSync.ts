import { useEffect } from 'react';
import { useEditor } from '../state/documentStore';

export function usePlayerSync(getCurrentTime?: () => number) {
  const { dispatch } = useEditor();

  useEffect(() => {
    if (!getCurrentTime) return;
    const interval = setInterval(() => {
      const t = getCurrentTime();
      dispatch({ type: 'SET_PLAYHEAD', payload: t });
    }, 100);
    return () => clearInterval(interval);
  }, [getCurrentTime, dispatch]);
}
