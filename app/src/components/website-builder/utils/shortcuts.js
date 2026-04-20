// src/editor/shortcuts.ts
import { handleUndo, handleRedo, toggleOutlines, togglePreview } from './grapesActions';

/**
 * Replaces default shortcuts.
 *
 * @param {any} editorRef - The editor ref value.
 */
export function replaceDefaultShortcuts(editorRef) {
  const editor = editorRef?.current;
  if (!editor) return;

  const km = editor.Keymaps;

  // Remove default key bindings (IDs may differ slightly depending on GrapesJS version)
  ['core:undo', 'core:redo', 'sw-visibility', 'core:preview'].forEach(km.remove, km);

  // Add your custom bindings
  km.add('my:undo', 'ctrl+z', () => handleUndo(editorRef));
  km.add('my:redo', 'ctrl+y', () => handleRedo(editorRef));
  km.add('my:toggle-outlines', 'alt+o', () => toggleOutlines(editorRef));
  km.add('my:toggle-preview', 'alt+p', () => togglePreview(editorRef));
}