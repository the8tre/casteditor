import { useCallback, useRef, useState } from 'react';
import { createElement } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEditor } from '../state/documentStore';
import { serializeCast } from '../serializer/castSerializer';
import { castThemeToSvgTerm } from '../theme/terminalThemes';

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerDownloadUrl(url: string, filename: string) {
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

async function renderSnapshotSvg(castText: string, playheadMs: number, svgTheme: ReturnType<typeof castThemeToSvgTerm>): Promise<string> {
  // svg-term's render() doesn't forward `at` to SvgTerm, so we call SvgTerm directly.
  // loadCast isn't in svg-term's public API, but load-asciicast (its dependency) is available.
  const [{ SvgTerm }, loadAsciicastMod, serverMod] = await Promise.all([
    import('svg-term'),
    import('load-asciicast') as unknown as Promise<{ load: (input: string, opts?: object) => unknown }>,
    import('react-dom/server.browser') as unknown as Promise<{ renderToStaticMarkup: (el: unknown) => string }>,
  ]);
  const cast = loadAsciicastMod.load(castText);
  return serverMod.renderToStaticMarkup(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(SvgTerm as any, {
      cast, theme: svgTheme, at: playheadMs,
      paddingX: 2, paddingY: 1, decorations: false, cursor: true,
    })
  );
}

export default function SnapshotButton() {
  const { state } = useEditor();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const basename = state.filename?.replace(/\.cast$/, '') ?? 'recording';

  const handleSnapshotSvg = useCallback(async () => {
    if (!state.document) return;
    setOpen(false);
    const castText = serializeCast(state.document);
    const playheadMs = state.playhead * 1000;
    const svgTheme = castThemeToSvgTerm(state.document.header.theme);
    const svg = await renderSnapshotSvg(castText, playheadMs, svgTheme);
    triggerDownload(svg, `${basename}-snapshot.svg`, 'image/svg+xml');
  }, [state.document, state.playhead, basename]);

  const handleSnapshotPng = useCallback(async () => {
    if (!state.document) return;
    setOpen(false);
    const castText = serializeCast(state.document);
    const playheadMs = state.playhead * 1000;
    const svgTheme = castThemeToSvgTerm(state.document.header.theme);
    const svg = await renderSnapshotSvg(castText, playheadMs, svgTheme);

    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    await new Promise<void>(resolve => { img.onload = () => resolve(); img.src = svgUrl; });
    URL.revokeObjectURL(svgUrl);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    canvas.toBlob(pngBlob => {
      if (!pngBlob) return;
      const pngUrl = URL.createObjectURL(pngBlob);
      triggerDownloadUrl(pngUrl, `${basename}-snapshot.png`);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
  }, [state.document, state.playhead, basename]);

  return (
    <>
      <ButtonGroup ref={anchorRef} variant="outlined" size="small" disabled={!state.document}>
        <Button startIcon={<CameraAltIcon />} onClick={handleSnapshotSvg}>
          Snapshot
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
                  <MenuItem onClick={handleSnapshotSvg}>svg</MenuItem>
                  <MenuItem onClick={handleSnapshotPng}>png</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
