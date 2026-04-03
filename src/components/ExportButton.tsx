import { useCallback } from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { useEditor } from '../state/documentStore';
import { serializeCast } from '../serializer/castSerializer';

export default function ExportButton() {
  const { state } = useEditor();

  const handleExport = useCallback(() => {
    if (!state.document) return;
    const text = serializeCast(state.document);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = state.filename ?? 'recording.cast';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.document, state.filename]);

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={!state.document}
      size="small"
    >
      Export
    </Button>
  );
}
