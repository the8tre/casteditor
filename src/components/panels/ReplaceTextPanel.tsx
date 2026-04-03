import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEditor } from '../../state/documentStore';
import { countMatches } from '../../transforms/replaceText';
import { getPanelColor } from '../../theme/panelColors';

export default function ReplaceTextPanel() {
  const { state, dispatch } = useEditor();
  const [search, setSearch] = useState('');
  const [replacement, setReplacement] = useState('');

  const matchCount = useMemo(
    () => (state.document && search ? countMatches(state.document, search) : 0),
    [state.document, search],
  );

  const canApply = search.length > 0 && matchCount > 0;

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Replace Text:
      </Typography>
      <TextField
        label="Search"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ width: 200 }}
      />
      <TextField
        label="Replace with"
        size="small"
        value={replacement}
        onChange={e => setReplacement(e.target.value)}
        sx={{ width: 200 }}
      />
      <Typography variant="caption" color="text.secondary">
        {search ? `${matchCount} match${matchCount !== 1 ? 'es' : ''}` : ''}
      </Typography>
      <Button
        variant="contained"
        size="small"
        disabled={!canApply}
        onClick={() => dispatch({ type: 'APPLY_REPLACE_TEXT', payload: { search, replacement } })}
        sx={{ bgcolor: `rgb(${getPanelColor('replaceText').r},${getPanelColor('replaceText').g},${getPanelColor('replaceText').b})`, '&:hover': { bgcolor: `rgba(${getPanelColor('replaceText').r},${getPanelColor('replaceText').g},${getPanelColor('replaceText').b},0.85)` } }}
      >
        Apply
      </Button>
    </Box>
  );
}
