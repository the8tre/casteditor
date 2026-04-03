import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';

const c = getPanelColor('addIdle');
const COLOR = `rgb(${c.r},${c.g},${c.b})`;
const COLOR_HOVER = `rgba(${c.r},${c.g},${c.b},0.85)`;

export default function AddIdlePanel() {
  const { state, dispatch } = useEditor();
  const [duration, setDuration] = useState(1.0);

  const handleApply = () => {
    dispatch({ type: 'APPLY_ADD_IDLE', payload: { atTime: state.playhead, duration } });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Add Idle at {state.playhead.toFixed(2)}s:
      </Typography>
      <Box sx={{ width: 260, mx: 1 }}>
        <Slider
          value={duration}
          onChange={(_, v) => setDuration(v as number)}
          min={0.1}
          max={10}
          step={0.1}
          marks={[
            { value: 0.5, label: '0.5s' },
            { value: 1, label: '1s' },
            { value: 2, label: '2s' },
            { value: 5, label: '5s' },
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={v => `${v}s`}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        insert: {duration.toFixed(2)}s
      </Typography>
      <Button
        variant="contained"
        onClick={handleApply}
        size="small"
        sx={{ bgcolor: COLOR, '&:hover': { bgcolor: COLOR_HOVER } }}
      >
        Add Idle
      </Button>
    </Box>
  );
}
