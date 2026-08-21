import { useState } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEditor } from '../../state/documentStore';
import { THEME_NAMES, svgTermThemes, castThemeToSvgTerm } from '../../theme/terminalThemes';
import type { SvgTermTheme } from '../../theme/terminalThemes';

type SelectionTheme = 'default' | typeof THEME_NAMES[number];

function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

function Swatch({ color, title }: { color: string; title: string }) {
  return (
    <Tooltip title={title} placement="top">
      <Box sx={{ width: 14, height: 14, bgcolor: color, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
    </Tooltip>
  );
}

function Swatches({ t }: { t: SvgTermTheme }) {
  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'nowrap' }}>
      <Swatch color={rgbToHex(t.background)} title="bg" />
      <Swatch color={rgbToHex(t.text)} title="fg" />
      <Box sx={{ width: 4 }} />
      {Array.from({ length: 16 }, (_, i) => (
        <Swatch key={i} color={rgbToHex(t[i as keyof SvgTermTheme] as [number, number, number])} title={`color ${i}`} />
      ))}
    </Box>
  );
}

export default function ThemePanel() {
  const { state, dispatch } = useEditor();
  const appliedTheme = state.activeTheme as SelectionTheme;
  const [selected, setSelected] = useState<SelectionTheme>(appliedTheme);

  const { document } = state;
  if (!document) return null;

  const previewTheme: SvgTermTheme | null =
    selected === 'default'
      ? castThemeToSvgTerm(document.header.theme)
      : svgTermThemes[selected];

  const handleApply = () => {
    dispatch({ type: 'APPLY_THEME', payload: { theme: selected } });
  };

  return (
    <Box sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
      <Select
        size="small"
        value={selected}
        onChange={e => setSelected(e.target.value as SelectionTheme)}
        sx={{ fontSize: '0.75rem', height: 28, minWidth: 150 }}
      >
        <MenuItem value="default" dense sx={{ fontSize: '0.75rem' }}>
          Cast default
        </MenuItem>
        {THEME_NAMES.map(name => (
          <MenuItem key={name} value={name} dense sx={{ fontSize: '0.75rem' }}>{name}</MenuItem>
        ))}
      </Select>

      {previewTheme ? (
        <Swatches t={previewTheme} />
      ) : (
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          no colors in cast
        </Typography>
      )}

      <Button
        variant="contained"
        size="small"
        onClick={handleApply}
        disabled={selected === appliedTheme}
        sx={{ height: 28, fontSize: '0.75rem' }}
      >
        Apply
      </Button>
    </Box>
  );
}
