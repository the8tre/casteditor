import { useRef, useEffect, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import type { CastDocument, TimeRange, PanelId } from '../../types/asciicast';
import { getPanelColor, EVENT_COLORS } from '../../theme/panelColors';

interface TimelineProps {
  document: CastDocument;
  playhead: number;
  selection: TimeRange | null;
  activePanel: PanelId | null;
  onSelectionChange: (range: TimeRange | null) => void;
  onSeek: (time: number) => void;
}

const RULER_HEIGHT = 20;
const TRACK_HEIGHT = 40;
const CANVAS_HEIGHT = RULER_HEIGHT + TRACK_HEIGHT;
const HANDLE_HIT_PX = 8; // pixels from edge that count as "on handle"
const PAD = 8; // horizontal padding so start/end are clearly visible

type DragMode = 'new' | 'left' | 'right' | 'move';

export default function Timeline({ document, playhead, selection, activePanel, onSelectionChange, onSeek }: TimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const playheadRef = useRef(playhead);
  playheadRef.current = playhead;
  const selectionRef = useRef(selection);
  selectionRef.current = selection;
  const activePanelRef = useRef(activePanel);
  activePanelRef.current = activePanel;

  // Active drag state (pixel positions, not committed to store yet)
  const dragRef = useRef<{
    mode: DragMode;
    startPx: number;
    endPx: number;
    anchorPx: number; // fixed edge when resizing
  } | null>(null);

  const durationRef = useRef(1);
  durationRef.current =
    document.header.duration ??
    (document.events.length > 0 ? document.events[document.events.length - 1].time : 1);

  const [cursor, setCursor] = useState<string>('crosshair');

  const pixelToTime = (px: number, width: number) =>
    Math.max(0, Math.min(durationRef.current, ((px - PAD) / (width - 2 * PAD)) * durationRef.current));

  const timeToPixel = (t: number, width: number) =>
    PAD + (t / durationRef.current) * (width - 2 * PAD);

  // Returns the drag mode for a given pointer position
  const getDragMode = useCallback((px: number, containerWidth: number): DragMode => {
    const sel = selectionRef.current;
    if (!sel) return 'new';
    const sx = timeToPixel(sel.start, containerWidth);
    const ex = timeToPixel(sel.end, containerWidth);
    if (Math.abs(px - sx) <= HANDLE_HIT_PX) return 'left';
    if (Math.abs(px - ex) <= HANDLE_HIT_PX) return 'right';
    if (px > sx && px < ex) return 'move';
    return 'new';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Static layer ─────────────────────────────────────────────────────────────
  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const dur = durationRef.current;

    const offscreen = window.document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const ctx = offscreen.getContext('2d')!;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#2d2d4e';
    ctx.fillRect(0, 0, W, RULER_HEIGHT);

    ctx.strokeStyle = '#888';
    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    const tickInterval = dur > 60 ? 10 : dur > 10 ? 2 : 1;
    for (let t = 0; t <= dur; t += tickInterval) {
      const x = PAD + (t / dur) * (W - 2 * PAD);
      ctx.beginPath();
      ctx.moveTo(x, 14);
      ctx.lineTo(x, RULER_HEIGHT);
      ctx.stroke();
      ctx.fillText(`${t}s`, x + 2, 12);
    }

    const bins = new Map<number, string>();
    for (const event of document.events) {
      const px = Math.round(PAD + (event.time / dur) * (W - 2 * PAD));
      if (!bins.has(px)) bins.set(px, event.type);
    }
    for (const [px, type] of bins) {
      ctx.fillStyle = EVENT_COLORS[type] ?? '#888';
      ctx.fillRect(px, RULER_HEIGHT + 5, 1, TRACK_HEIGHT - 10);
    }

    staticCanvasRef.current = offscreen;
  }, [document]);

  // ── rAF loop ─────────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const tick = () => {
      const canvas = canvasRef.current;
      const staticCanvas = staticCanvasRef.current;
      if (canvas && staticCanvas) {
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width;
        const H = canvas.height;
        const dur = durationRef.current;

        ctx.drawImage(staticCanvas, 0, 0);

        let sel: TimeRange | null = null;
        if (dragRef.current) {
          const d = dragRef.current;
          if (d.mode === 'new') {
            sel = {
              start: pixelToTime(Math.min(d.startPx, d.endPx), W),
              end: pixelToTime(Math.max(d.startPx, d.endPx), W),
            };
          } else if (d.mode === 'left') {
            sel = {
              start: pixelToTime(Math.min(d.endPx, d.anchorPx), W),
              end: pixelToTime(Math.max(d.endPx, d.anchorPx), W),
            };
          } else if (d.mode === 'right') {
            sel = {
              start: pixelToTime(Math.min(d.anchorPx, d.endPx), W),
              end: pixelToTime(Math.max(d.anchorPx, d.endPx), W),
            };
          } else if (d.mode === 'move') {
            const delta = d.endPx - d.startPx;
            const committed = selectionRef.current;
            if (committed) {
              const sx = timeToPixel(committed.start, W);
              const ex = timeToPixel(committed.end, W);
              sel = {
                start: pixelToTime(sx + delta, W),
                end: pixelToTime(ex + delta, W),
              };
            }
          }
        } else {
          sel = selectionRef.current;
        }

        if (sel && sel.end > sel.start) {
          const sx = PAD + (sel.start / dur) * (W - 2 * PAD);
          const ex = PAD + (sel.end / dur) * (W - 2 * PAD);
          const { r, g, b } = getPanelColor(activePanelRef.current);
          ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;
          ctx.fillRect(sx, RULER_HEIGHT, ex - sx, TRACK_HEIGHT);
          ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, RULER_HEIGHT, ex - sx, TRACK_HEIGHT);
        }

        // Playhead
        const ph = PAD + (playheadRef.current / dur) * (W - 2 * PAD);
        ctx.strokeStyle = '#f44336';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ph, 0);
        ctx.lineTo(ph, H);
        ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Resize observer ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ro = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = CANVAS_HEIGHT;
      drawStatic();
    });
    ro.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = CANVAS_HEIGHT;
    drawStatic();

    return () => ro.disconnect();
  }, [drawStatic]);

  useEffect(() => { drawStatic(); }, [drawStatic]);

  useEffect(() => {
    startLoop();
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [startLoop]);

  // ── Pointer handlers (global capture so drag survives leaving the element) ────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const W = rect.width;
    const mode = getDragMode(px, W);

    if (mode === 'move') {
      dragRef.current = { mode, startPx: px, endPx: px, anchorPx: px };
    } else if (mode === 'left') {
      const sel = selectionRef.current!;
      dragRef.current = { mode, startPx: px, endPx: px, anchorPx: timeToPixel(sel.end, W) };
    } else if (mode === 'right') {
      const sel = selectionRef.current!;
      dragRef.current = { mode, startPx: px, endPx: px, anchorPx: timeToPixel(sel.start, W) };
    } else {
      dragRef.current = { mode: 'new', startPx: px, endPx: px, anchorPx: px };
    }

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;

    if (dragRef.current) {
      dragRef.current = { ...dragRef.current, endPx: px };
    } else {
      const mode = getDragMode(px, rect.width);
      if (mode === 'left' || mode === 'right') setCursor('ew-resize');
      else if (mode === 'move') setCursor('grab');
      else setCursor('crosshair');
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const W = rect.width;
    const px = e.clientX - rect.left;
    const d = dragRef.current;
    dragRef.current = null;
    setCursor('crosshair');

    if (d.mode === 'new') {
      const start = pixelToTime(Math.min(d.startPx, px), W);
      const end = pixelToTime(Math.max(d.startPx, px), W);
      if (end - start < 0.05) {
        onSeek(pixelToTime(d.startPx, W));
        onSelectionChange(null);
      } else {
        onSelectionChange({ start, end });
      }
    } else if (d.mode === 'left' || d.mode === 'right') {
      const start = pixelToTime(Math.min(d.anchorPx, px), W);
      const end = pixelToTime(Math.max(d.anchorPx, px), W);
      if (end - start < 0.05) {
        onSelectionChange(null);
      } else {
        onSelectionChange({ start, end });
      }
    } else if (d.mode === 'move') {
      const delta = px - d.startPx;
      const committed = selectionRef.current;
      if (committed) {
        const dur = durationRef.current;
        const width = committed.end - committed.start;
        const sx = timeToPixel(committed.start, W);
        const newStart = pixelToTime(sx + delta, W);
        const clampedStart = Math.max(0, Math.min(dur - width, newStart));
        onSelectionChange({ start: clampedStart, end: clampedStart + width });
      }
    }
  };

  // ── Handle positions for DOM handles ─────────────────────────────────────────
  // We compute % positions so they track the canvas naturally
  const containerW = containerRef.current?.clientWidth || 1;
  const selPct = selection && selection.end > selection.start
    ? {
        start: (timeToPixel(selection.start, containerW) / containerW) * 100,
        end:   (timeToPixel(selection.end,   containerW) / containerW) * 100,
      }
    : null;

  const { r, g, b } = getPanelColor(activePanel);
  const handleColor = `rgba(${r},${g},${b},0.9)`;

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', width: '100%', height: CANVAS_HEIGHT, overflow: 'hidden', bgcolor: '#1a1a2e' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: CANVAS_HEIGHT }} />

      {/* Selection handles */}
      {selPct && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: RULER_HEIGHT,
              left: `${selPct.start}%`,
              width: 8,
              height: TRACK_HEIGHT,
              transform: 'translateX(-50%)',
              bgcolor: handleColor,
              borderRadius: '2px 0 0 2px',
              cursor: 'ew-resize',
              pointerEvents: 'none',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 2,
                height: '40%',
                bgcolor: 'rgba(255,255,255,0.6)',
                borderRadius: 1,
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: RULER_HEIGHT,
              left: `${selPct.end}%`,
              width: 8,
              height: TRACK_HEIGHT,
              transform: 'translateX(-50%)',
              bgcolor: handleColor,
              borderRadius: '0 2px 2px 0',
              cursor: 'ew-resize',
              pointerEvents: 'none',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 2,
                height: '40%',
                bgcolor: 'rgba(255,255,255,0.6)',
                borderRadius: 1,
              },
            }}
          />
        </>
      )}

      {/* Interaction overlay */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ position: 'absolute', inset: 0, cursor }}
      />
    </Box>
  );
}
