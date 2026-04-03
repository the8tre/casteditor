import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';

export default function CutPanel() {
  const { state, dispatch } = useEditor();
  const duration = state.document?.header.duration ?? 0;

  const start = state.selection?.start ?? 0;
  const end = state.selection?.end ?? Math.min(1, duration);

  const setStart = (v: number) => {
    dispatch({ type: 'SET_SELECTION', payload: { start: Math.max(0, Math.min(v, end)), end } });
  };
  const setEnd = (v: number) => {
    dispatch({ type: 'SET_SELECTION', payload: { start, end: Math.min(duration, Math.max(v, start)) } });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Cut — remove between:
      </Typography>
      <TextField
        label="Start (s)"
        type="number"
        size="small"
        value={start}
        onChange={e => setStart(Number(e.target.value))}
        inputProps={{ min: 0, max: end, step: 0.01 }}
        sx={{ width: 140 }}
      />
      <TextField
        label="End (s)"
        type="number"
        size="small"
        value={end}
        onChange={e => setEnd(Number(e.target.value))}
        inputProps={{ min: start, max: duration, step: 0.01 }}
        sx={{ width: 140 }}
      />
      <Typography variant="caption" color="text.secondary">
        removing: {(end - start).toFixed(2)}s
      </Typography>
      <Button variant="contained" onClick={() =>
        dispatch({ type: 'APPLY_CUT', payload: { start, end } })
      } size="small" sx={{ bgcolor: `rgb(${getPanelColor('cut').r},${getPanelColor('cut').g},${getPanelColor('cut').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('cut').r},${getPanelColor('cut').g},${getPanelColor('cut').b},0.85)` } }}>
        Apply Cut
      </Button>
    </Box>
  );
}
