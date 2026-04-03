import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { useEditor } from '../../state/documentStore';
import { getPanelColor } from '../../theme/panelColors';

export default function RemoveIdlePanel() {
  const { dispatch } = useEditor();
  const [threshold, setThreshold] = useState(2.0);

  const handleApply = () => {
    dispatch({ type: 'APPLY_REMOVE_IDLE', payload: { threshold } });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Remove Idle:
      </Typography>
      <Box sx={{ width: 260, mx: 1 }}>
        <Slider
          value={threshold}
          onChange={(_, v) => setThreshold(v as number)}
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
        max gap: {threshold.toFixed(2)}s
      </Typography>
      <Button variant="contained" onClick={handleApply} size="small" sx={{ bgcolor: `rgb(${getPanelColor('removeIdle').r},${getPanelColor('removeIdle').g},${getPanelColor('removeIdle').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('removeIdle').r},${getPanelColor('removeIdle').g},${getPanelColor('removeIdle').b},0.85)` } }}>
        Remove Idle
      </Button>
    </Box>
  );
}
