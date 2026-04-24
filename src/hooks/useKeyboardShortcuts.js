import { useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';

export function useKeyboardShortcuts() {
  const { selectedItemId, removeItem, duplicateItem, undo, redo, selectItem, isPreviewMode } =
    useBuilderStore();

  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Ctrl+Z → undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      // Ctrl+Y / Ctrl+Shift+Z → redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
        return;
      }

      if (isEditing || isPreviewMode) return;

      // Delete / Backspace → eliminar bloque seleccionado
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItemId) {
        e.preventDefault();
        removeItem(selectedItemId);
        return;
      }
      // Escape → deseleccionar
      if (e.key === 'Escape') {
        selectItem(null);
        return;
      }
      // Ctrl+D → duplicar
      if (e.ctrlKey && e.key === 'd' && selectedItemId) {
        e.preventDefault();
        duplicateItem(selectedItemId);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, isPreviewMode, removeItem, duplicateItem, undo, redo, selectItem]);
}
