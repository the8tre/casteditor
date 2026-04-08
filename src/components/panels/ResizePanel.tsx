import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';

export default function ResizePanel() {
  const { state, dispatch } = useEditor();
  const [width, setWidth] = useState(state.document?.header.width ?? 80);
  const [height, setHeight] = useState(state.document?.header.height ?? 24);
  const [truncate, setTruncate] = useState(false);

  const handleApply = () => {
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    dispatch({ type: 'APPLY_RESIZE', payload: { width: w, height: h, truncate } });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Resize:
      </Typography>
      <TextField
        label="Width (cols)"
        type="number"
        size="small"
        value={width}
        onChange={e => setWidth(Number(e.target.value))}
        inputProps={{ min: 1, max: 1000 }}
        sx={{ width: 140 }}
      />
      <TextField
        label="Height (rows)"
        type="number"
        size="small"
        value={height}
        onChange={e => setHeight(Number(e.target.value))}
        inputProps={{ min: 1, max: 500 }}
        sx={{ width: 140 }}
      />
      <Tooltip title="Truncate lines longer than the new width and append an ellipsis (…)">
        <FormControlLabel
          control={<Checkbox size="small" checked={truncate} onChange={e => setTruncate(e.target.checked)} />}
          label={<Typography variant="body2">Truncate lines</Typography>}
        />
      </Tooltip>
      <Button variant="contained" onClick={handleApply} size="small" sx={{ bgcolor: `rgb(${getPanelColor('resize').r},${getPanelColor('resize').g},${getPanelColor('resize').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('resize').r},${getPanelColor('resize').g},${getPanelColor('resize').b},0.85)` } }}>
        Apply Resize
      </Button>
      {truncate && (
        <Typography variant="caption" color="warning.main">
          ⚠️ Truncation is destructive — only Undo can recover the original data.
        </Typography>
      )}
    </Box>
  );
}
