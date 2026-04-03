import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEditor } from '../../state/documentStore';
import { EVENT_COLORS, EVENT_LABELS } from '../../theme/panelColors';

export default function InfoPanel() {
  const { state } = useEditor();
  const { document, filename } = state;
  if (!document) return null;

  const { header, events } = document;
  const duration = header.duration ?? (events.length > 0 ? events[events.length - 1].time : 0);

  const counts: Record<string, number> = {};
  for (const e of events) counts[e.type] = (counts[e.type] ?? 0) + 1;

  return (
    <Box sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 3, height: '100%', flexWrap: 'wrap' }}>
      {/* File info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {filename && (
          <Typography variant="caption" color="text.secondary">
            {filename}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {header.width}×{header.height}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {duration.toFixed(2)}s
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {events.length} events
        </Typography>
        {header.title && (
          <Typography variant="caption" color="text.secondary">
            "{header.title}"
          </Typography>
        )}
      </Box>

      {/* Divider */}
      <Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />

      {/* Event color legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {Object.entries(EVENT_LABELS).map(([type, label]) => (
          <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: EVENT_COLORS[type] }} />
            <Typography variant="caption" color="text.secondary">
              {label} {counts[type] != null ? `(${counts[type]})` : '(0)'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
