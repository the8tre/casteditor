import { useState } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEditor } from '../../state/documentStore';
import { THEME_NAMES, svgTermThemes, castThemeToSvgTerm } from '../../theme/terminalThemes';
import type { SvgTermTheme } from '../../theme/terminalThemes';

type SelectionTheme = 'default' | typeof THEME_NAMES[number];

function rgb(c: [number, number, number]): string {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function TerminalPreview({ t }: { t: SvgTermTheme }) {
  const W = 228, H = 50;
  const bw = 22, bh = 13;
  const padX = 6, padY = 5;
  const gap = 2;

  return (
    <svg width={W} height={H} style={{ borderRadius: 4, flexShrink: 0, display: 'block' }}>
      <rect width={W} height={H} fill={rgb(t.background)} rx={4} />
      {Array.from({ length: 16 }, (_, i) => {
        const col = i % 8;
        const row = Math.floor(i / 8);
        const x = padX + col * (bw + gap);
        const y = padY + row * (bh + gap);
        return <rect key={i} x={x} y={y} width={bw} height={bh} fill={rgb(t[i as 0])} />;
      })}
      <text x={padX} y={H - 6} fill={rgb(t.text)} fontSize={8} fontFamily="monospace">
        {`bg:${rgb(t.background)}  fg:${rgb(t.text)}`}
      </text>
    </svg>
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
        <TerminalPreview t={previewTheme} />
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

