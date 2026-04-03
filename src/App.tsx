import { EditorProvider, useEditor } from './state/documentStore';
import DropZone from './components/DropZone';
import EditorLayout from './components/EditorLayout';

function AppInner() {
  const { state } = useEditor();
  return state.document ? <EditorLayout /> : <DropZone />;
}

export default function App() {
  return (
    <EditorProvider>
      <AppInner />
    </EditorProvider>
  );
}
