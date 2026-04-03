import { useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useEditor } from '../state/documentStore';
import PlayerBridge from '../player/PlayerBridge';
import type { PlayerBridgeHandle } from '../player/PlayerBridge';
import Timeline from './timeline/Timeline';
import MainToolbar from './panels/MainToolbar';
import EditToolbar from './panels/EditToolbar';
import TrimPanel from './panels/TrimPanel';
import CutPanel from './panels/CutPanel';
import SpeedPanel from './panels/SpeedPanel';
import RemoveIdlePanel from './panels/RemoveIdlePanel';
import NormalizeInputPanel from './panels/NormalizeInputPanel';
import ResizePanel from './panels/ResizePanel';
import ReplaceTextPanel from './panels/ReplaceTextPanel';
import InfoPanel from './panels/InfoPanel';

const GLOBAL_PANELS = new Set(['resize', 'replaceText', 'info']);

export default function EditorLayout() {
  const { state, dispatch } = useEditor();
  const { document, selection, playhead, activePanel } = state;
  const playerRef = useRef<PlayerBridgeHandle>(null);

  if (!document) return null;

  const isGlobal = activePanel !== null && GLOBAL_PANELS.has(activePanel);

  const handleTimeUpdate = (time: number) => {
    dispatch({ type: 'SET_PLAYHEAD', payload: time });
  };

  const handleSelectionChange = (range: import('../types/asciicast').TimeRange | null) => {
    if (isGlobal) return;
    dispatch({ type: 'SET_SELECTION', payload: range });
  };

  const handleSeek = (time: number) => {
    playerRef.current?.seek(time);
    dispatch({ type: 'SET_PLAYHEAD', payload: time });
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'info': return <InfoPanel />;
      case 'trim': return <TrimPanel />;
      case 'cut': return <CutPanel />;
      case 'speed': return <SpeedPanel />;
      case 'removeIdle': return <RemoveIdlePanel />;
      case 'normalizeInput': return <NormalizeInputPanel />;
      case 'resize': return <ResizePanel />;
      case 'replaceText': return <ReplaceTextPanel />;
      default: return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Box
        component="a"
        href="https://github.com/the8tre/casteditor"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 64,
          height: 64,
          overflow: 'hidden',
          zIndex: 1200,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            borderStyle: 'solid',
            borderWidth: '0 64px 64px 0',
            borderColor: 'transparent #fff transparent transparent',
          },
        }}
      >
        <GitHubIcon sx={{ position: 'absolute', top: 6, right: 6, fontSize: 28, color: '#000', transform: 'rotate(45deg)' }} />
      </Box>

      <MainToolbar />

      <Box sx={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden', p: 1 }}>
        <PlayerBridge ref={playerRef} document={document} onTimeUpdate={handleTimeUpdate} />
      </Box>

      <Box sx={{ flex: '0 0 auto', mx: 1 }}>
        <Timeline
          document={document}
          playhead={playhead}
          selection={isGlobal ? null : selection}
          activePanel={isGlobal ? null : activePanel}
          onSelectionChange={handleSelectionChange}
          onSeek={handleSeek}
        />
      </Box>

      <Paper
        elevation={0}
        square
        sx={{ flex: '0 0 auto', borderTop: 1, borderColor: 'divider' }}
      >
        <EditToolbar />
        <Box sx={{ height: 72 }}>
          {activePanel && renderPanel()}
        </Box>
      </Paper>
    </Box>
  );
}
