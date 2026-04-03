import { useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useFileLoader } from '../hooks/useFileLoader';

export default function DropZone() {
  const { loadFile } = useFileLoader();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', p: 4, boxSizing: 'border-box' }}>
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 3,
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' },
      }}
      onClick={() => inputRef.current?.click()}
    >
      <UploadFileIcon sx={{ fontSize: 64, color: 'primary.main' }} />
      <Typography variant="h5" component="h1">
        Drop a <code>.cast</code> file here
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to browse
      </Typography>
      <Button variant="outlined" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
        Open File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".cast"
        hidden
        onChange={handleFileChange}
      />
    </Box>
    </Box>
  );
}
