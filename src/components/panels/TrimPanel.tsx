import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';

export default function TrimPanel() {
  const { state, dispatch } = useEditor();
  const duration = state.document?.header.duration ?? 0;

  const start = state.selection?.start ?? 0;
  const end = state.selection?.end ?? duration;

  const setStart = (v: number) => {
    dispatch({ type: 'SET_SELECTION', payload: { start: Math.max(0, Math.min(v, end)), end } });
  };
  const setEnd = (v: number) => {
    dispatch({ type: 'SET_SELECTION', payload: { start, end: Math.min(duration, Math.max(v, start)) } });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Trim — keep between:
      </Typography>
      <TextField
        label="In point (s)"
        type="number"
        size="small"
        value={start}
        onChange={e => setStart(Number(e.target.value))}
        inputProps={{ min: 0, max: end, step: 0.01 }}
        sx={{ width: 140 }}
      />
      <TextField
        label="Out point (s)"
        type="number"
        size="small"
        value={end}
        onChange={e => setEnd(Number(e.target.value))}
        inputProps={{ min: start, max: duration, step: 0.01 }}
        sx={{ width: 140 }}
      />
      <Typography variant="caption" color="text.secondary">
        duration: {(end - start).toFixed(2)}s
      </Typography>
      <Button variant="contained" onClick={() =>
        dispatch({ type: 'APPLY_TRIM', payload: { inPoint: start, outPoint: end } })
      } size="small" sx={{ bgcolor: `rgb(${getPanelColor('trim').r},${getPanelColor('trim').g},${getPanelColor('trim').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('trim').r},${getPanelColor('trim').g},${getPanelColor('trim').b},0.85)` } }}>
        Apply Trim
      </Button>
    </Box>
  );
}
