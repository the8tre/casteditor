import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';

export default function SpeedPanel() {
  const { state, dispatch } = useEditor();
  const [multiplier, setMultiplier] = useState(1.0);
  const [useRange, setUseRange] = useState(false);

  const hasSelection = state.selection !== null;

  const handleApply = () => {
    dispatch({
      type: 'APPLY_SPEED',
      payload: {
        multiplier,
        range: useRange && state.selection ? state.selection : undefined,
      },
    });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Speed:
      </Typography>
      <Box sx={{ width: 260, mx: 1 }}>
        <Slider
          value={multiplier}
          onChange={(_, v) => setMultiplier(v as number)}
          min={0.1}
          max={10}
          step={0.1}
          marks={[
            { value: 0.5, label: '0.5×' },
            { value: 1, label: '1×' },
            { value: 2, label: '2×' },
            { value: 5, label: '5×' },
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={v => `${v}×`}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {multiplier.toFixed(2)}×{multiplier > 1 ? ' (faster)' : multiplier < 1 ? ' (slower)' : ''}
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={useRange && hasSelection}
            onChange={e => setUseRange(e.target.checked)}
            disabled={!hasSelection}
            size="small"
          />
        }
        label={<Typography variant="caption">{hasSelection ? 'Selection only' : 'Selection only (none)'}</Typography>}
      />
      <Button variant="contained" onClick={handleApply} size="small" sx={{ bgcolor: `rgb(${getPanelColor('speed').r},${getPanelColor('speed').g},${getPanelColor('speed').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('speed').r},${getPanelColor('speed').g},${getPanelColor('speed').b},0.85)` } }}>
        Apply Speed
      </Button>
    </Box>
  );
}
