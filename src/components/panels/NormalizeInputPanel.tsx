import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function NormalizeInputPanel() {
  const { state, dispatch } = useEditor();
  const [interval, setInterval] = useLocalStorage('tools.normalizeInput.interval', 0.1);

  const inputCount = state.document?.events.filter(e => e.type === 'i').length ?? 0;

  const handleApply = () => {
    dispatch({ type: 'APPLY_NORMALIZE_INPUT', payload: { interval } });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2">
        Normalize Input — even keystroke spacing
      </Typography>
      <TextField
        label="Key interval (s)"
        type="number"
        size="small"
        value={interval}
        onChange={e => setInterval(Math.max(0.01, Math.min(5, Number(e.target.value))))}
        inputProps={{ min: 0.01, max: 5, step: 0.01 }}
        sx={{ width: 140 }}
      />
      <Typography variant="caption" color="text.secondary">
        {inputCount} input event{inputCount !== 1 ? 's' : ''}
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={handleApply}
        disabled={inputCount === 0}
        sx={{ bgcolor: `rgb(${getPanelColor('normalizeInput').r},${getPanelColor('normalizeInput').g},${getPanelColor('normalizeInput').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('normalizeInput').r},${getPanelColor('normalizeInput').g},${getPanelColor('normalizeInput').b},0.85)` } }}
      >
        Apply
      </Button>
      {inputCount === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          💡 No input events in this cast. Use <code>--stdin</code> during recording.
        </Typography>
      )}
    </Box>
  );
}
