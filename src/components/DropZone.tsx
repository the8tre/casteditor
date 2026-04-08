import { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useFileLoader } from '../hooks/useFileLoader';
import { parseCast } from '../parser/castParser';
import { useEditor } from '../state/documentStore';

const SAMPLE_URL = "https://asciinema.org/a/335480.cast";

export default function DropZone() {
  const { loadFile } = useFileLoader();
  const { dispatch } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingSample, setLoadingSample] = useState(false);

  const loadSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingSample(true);
    try {
      const res = await fetch(SAMPLE_URL);
      const text = await res.text();
      const document = parseCast(text);
      dispatch({ type: 'LOAD_FILE', payload: { document, filename: 'sample.cast' } });
    } catch (err) {
      alert(`Failed to load sample: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingSample(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        p: 4,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <Box
        component="a"
        href="https://github.com/the8tre/casteditor"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 64,
          height: 64,
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            borderStyle: "solid",
            borderWidth: "0 64px 64px 0",
            borderColor: "transparent #fff transparent transparent",
          },
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
        }}
      >
        <GitHubIcon
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            fontSize: 28,
            color: "#000",
            transform: "rotate(45deg)",
          }}
        />
      </Box>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 3,
          border: "2px dashed",
          borderColor: "primary.main",
          borderRadius: 2,
          cursor: "pointer",
          "&:hover": { borderColor: "primary.light", bgcolor: "action.hover" },
        }}
        onClick={() => inputRef.current?.click()}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{ fontWeight: 700, letterSpacing: 0, userSelect: "none" }}
        >
          Cast
          <Box component="span" sx={{ opacity: 0.45, fontWeight: 400 }}>
            /edit/
          </Box>
          or
        </Typography>
        <Typography variant="body2" color="text.secondary">
          create your cast with
        </Typography>
        <Typography
          component="a"
          href="https://docs.asciinema.org/getting-started/"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          color="text.secondary"
          onClick={(e) => e.stopPropagation()}
          sx={{ fontFamily: "monospace", userSelect: "all" }}
        >
          asciinema record --output-format asciicast-v2 --stdin my_nice.cast
        </Typography>
        <UploadFileIcon sx={{ fontSize: 64, color: "primary.main" }} />
        <Typography variant="h5" component="h1">
          Drop a <code>.cast</code> file here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse
        </Typography>
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Open File
        </Button>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
        <Button
          variant="outlined"
          onClick={loadSample}
          disabled={loadingSample}
        >
          {loadingSample ? "Loading…" : "Load Sample"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".cast"
          hidden
          onChange={handleFileChange}
        />
      </Box>
    </Box>
  );
}
