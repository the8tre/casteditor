import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useRef, useState } from 'react';
import { useEditor } from '../../state/documentStore';
import { useFileLoader } from '../../hooks/useFileLoader';
import ExportButton from '../ExportButton';
import { THEME_NAMES } from '../../theme/terminalThemes';
import type { ThemeName } from '../../theme/terminalThemes';

interface MainToolbarProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export default function MainToolbar({ theme, onThemeChange }: MainToolbarProps) {
  const { state, dispatch } = useEditor();
  const { loadFile } = useFileLoader();
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
      e.target.value = '';
    }
  };

  const handleLogoClick = () => {
    if (state.past.length > 0) {
      setConfirmOpen(true);
    } else {
      dispatch({ type: 'CLOSE_FILE' });
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    dispatch({ type: 'CLOSE_FILE' });
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        <Typography
          variant="h6"
          sx={{ mr: 2, fontWeight: 700, letterSpacing: 0, cursor: 'pointer', '&:hover': { opacity: 0.75 } }}
          onClick={handleLogoClick}
        >
          Cast<Box component="span" sx={{ opacity: 0.45, fontWeight: 400 }}>/edit/</Box>or
        </Typography>

        {state.filename && (
          <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
            {state.filename}
          </Typography>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center', pr: '56px' }}>
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

          <Select
            size="small"
            value={theme}
            onChange={e => onThemeChange(e.target.value as ThemeName)}
            sx={{ fontSize: '0.75rem', height: 30, minWidth: 110 }}
          >
            {THEME_NAMES.map(name => (
              <MenuItem key={name} value={name} dense sx={{ fontSize: '0.75rem' }}>{name}</MenuItem>
            ))}
          </Select>

          <ExportButton theme={theme} />
        </Box>

        <input
          ref={inputRef}
          type="file"
          accept=".cast"
          hidden
          onChange={handleFileChange}
        />
      </Toolbar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Going back to the landing page will discard them.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="error">Discard & go back</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
