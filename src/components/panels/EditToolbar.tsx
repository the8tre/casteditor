import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useEditor } from '../../state/documentStore';
import type { PanelId } from '../../types/asciicast';

const PANELS: { id: PanelId; label: string }[] = [
  { id: 'info', label: 'Info' },
  { id: 'resize', label: 'Resize' },
  { id: 'speed', label: 'Speed' },
  { id: 'trim', label: 'Trim' },
  { id: 'cut', label: 'Cut' },
  { id: 'removeIdle', label: 'Remove Idle' },
  { id: 'normalizeInput', label: 'Normalize Input' },
  { id: 'replaceText', label: 'Replace Text' },
];

export default function EditToolbar() {
  const { state, dispatch } = useEditor();

  const handleChange = (_: React.SyntheticEvent, value: PanelId | 'none') => {
    dispatch({ type: 'SET_ACTIVE_PANEL', payload: value === 'none' ? null : value });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={state.activePanel ?? false}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
      >
        {PANELS.map(p => (
          <Tab key={p.id} value={p.id} label={p.label} />
        ))}
      </Tabs>
    </Box>
  );
}
