import { useCallback, useRef, useState } from 'react';import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEditor } from '../state/documentStore';
import { serializeCast } from '../serializer/castSerializer';
import { useLocalStorage } from '../hooks/useLocalStorage';

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButton() {
  const { state } = useEditor();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [svgDialogOpen, setSvgDialogOpen] = useState(false);
  const [svgWindow, setSvgWindow] = useLocalStorage('export.svg.window', true);
  const [svgCursor, setSvgCursor] = useLocalStorage('export.svg.cursor', true);

  const handleExportCast = useCallback(() => {
    if (!state.document) return;
    const text = serializeCast(state.document);
    triggerDownload(text, state.filename ?? 'recording.cast', 'text/plain');
  }, [state.document, state.filename]);

  const handleExportSvg = useCallback(async () => {
    if (!state.document) return;
    setSvgDialogOpen(false);
    const castText = serializeCast(state.document);
    const { render } = await import('svg-term');
    const svg = render(castText, { window: svgWindow, paddingX: 2, paddingY: 1, cursor: svgCursor });
    const basename = state.filename?.replace(/\.cast$/, '') ?? 'recording';
    triggerDownload(svg, `${basename}.svg`, 'image/svg+xml');
  }, [state.document, state.filename, svgWindow, svgCursor]);

  return (
    <>
      <ButtonGroup ref={anchorRef} variant="contained" size="small" disabled={!state.document}>
        <Button startIcon={<DownloadIcon />} onClick={handleExportCast}>
          Export
        </Button>
        <Button size="small" onClick={() => setOpen(o => !o)} sx={{ px: 0.5, minWidth: 'unset' }}>
          <ArrowDropDownIcon fontSize="small" />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal placement="bottom-end" style={{ zIndex: 1300 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList dense>
                  <MenuItem onClick={handleExportCast}>asciicast v2</MenuItem>
                  <MenuItem onClick={() => { setOpen(false); setSvgDialogOpen(true); }}>svg</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Dialog open={svgDialogOpen} onClose={() => setSvgDialogOpen(false)}>
        <DialogTitle>Export SVG</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={svgWindow} onChange={e => setSvgWindow(e.target.checked)} />}
            label="Window chrome"
          />
          <FormControlLabel
            control={<Checkbox checked={svgCursor} onChange={e => setSvgCursor(e.target.checked)} />}
            label="Cursor"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSvgDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExportSvg}>Export</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
