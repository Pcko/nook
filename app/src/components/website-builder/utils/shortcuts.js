// src/editor/shortcuts.ts
import { handleUndo, handleRedo, toggleOutlines, togglePreview } from './grapesActions';

/**
 * Replace default GrapesJS keyboard shortcuts with custom ones.
 * @param editorRef - React ref containing the GrapesJS editor instance.
 */
export function replaceDefaultShortcuts(editorRef) {
  const editor = editorRef?.current;
  if (!editor) return;

  const km = editor.Keymaps;

  // Remove default key bindings (IDs may differ slightly depending on GrapesJS version)
  km.remove('core:undo');
  km.remove('core:redo');
  km.remove('sw-visibility');
  km.remove('core:preview');


  // Add your custom bindings
  km.add('my:undo', 'ctrl+z', () => handleUndo(editorRef));
  km.add('my:redo', 'ctrl+y', () => handleRedo(editorRef));
  km.add('my:toggle-outlines', 'alt+o', () => toggleOutlines(editorRef));
  km.add('my:toggle-preview', 'alt+p', () => togglePreview(editorRef));
}