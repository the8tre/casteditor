import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import GitHubIcon from '@mui/icons-material/GitHub';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useRef } from 'react';
import { useEditor } from '../../state/documentStore';
import { useFileLoader } from '../../hooks/useFileLoader';
import ExportButton from '../ExportButton';

export default function MainToolbar() {
  const { state, dispatch } = useEditor();
  const { loadFile } = useFileLoader();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
      e.target.value = '';
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        <Typography variant="h6" sx={{ mr: 2, fontWeight: 700, letterSpacing: 0 }}>
          cast<Box component="span" sx={{ opacity: 0.45, fontWeight: 400 }}>(edit)</Box>or
        </Typography>

        {state.filename && (
          <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
            {state.filename}
          </Typography>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Open file">
            <IconButton size="small" onClick={() => inputRef.current?.click()}>
              <FolderOpenIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Undo (Cmd+Z)">
            <span>
              <IconButton
                size="small"
                onClick={() => dispatch({ type: 'UNDO' })}
                disabled={state.past.length === 0}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Redo (Cmd+Shift+Z)">
            <span>
              <IconButton
                size="small"
                onClick={() => dispatch({ type: 'REDO' })}
                disabled={state.future.length === 0}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <ExportButton />

          <Tooltip title="View on GitHub">
            <IconButton size="small" component="a" href="https://github.com/the8tre/casteditor" target="_blank" rel="noopener noreferrer">
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <input
          ref={inputRef}
          type="file"
          accept=".cast"
          hidden
          onChange={handleFileChange}
        />
      </Toolbar>
    </AppBar>
  );
}
