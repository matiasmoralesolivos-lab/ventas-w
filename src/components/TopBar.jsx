import { useBuilderStore } from '../store/useBuilderStore';
import { RUBROS } from '../data/rubrosConfig';

export default function TopBar() {
  const {
    pageConfig, updatePageConfig, rubro, togglePreviewMode, isPreviewMode,
    resetBuilder, viewMode, setViewMode, undo, redo, past, future,
    layout, selectedItemId, duplicateItem,
  } = useBuilderStore();

  const rubroObj = RUBROS.find(r => r.id === rubro);
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const hasSelection = !!selectedItemId;

  return (
    <div className="topbar">
      <span className="topbar-logo">🚀 WAUP</span>
      <div className="topbar-divider" />
      {rubroObj && (
        <span className="topbar-rubro-badge">{rubroObj.emoji} {rubroObj.label}</span>
      )}
      <div className="topbar-divider" />
      <input
        className="topbar-name"
        value={pageConfig.name}
        onChange={e => updatePageConfig({ name: e.target.value })}
        placeholder="Nombre de tu página"
        title="Editá el nombre de tu página"
      />

      <div className="topbar-spacer" />

      {/* Undo / Redo */}
      <div className="topbar-btn-group">
        <button
          className={`btn btn-icon${canUndo ? '' : ' disabled'}`}
          onClick={undo}
          disabled={!canUndo}
          title="Deshacer (Ctrl+Z)"
        >↩</button>
        <button
          className={`btn btn-icon${canRedo ? '' : ' disabled'}`}
          onClick={redo}
          disabled={!canRedo}
          title="Rehacer (Ctrl+Y)"
        >↪</button>
      </div>

      {/* Duplicate selected */}
      {hasSelection && (
        <button
          className="btn btn-ghost"
          onClick={() => duplicateItem(selectedItemId)}
          title="Duplicar bloque (Ctrl+D)"
        >
          ⧉ Duplicar
        </button>
      )}

      <div className="topbar-divider" />

      {/* View mode toggle */}
      <div className="topbar-btn-group">
        <button
          className={`btn btn-icon${viewMode === 'desktop' ? ' btn-view-active' : ''}`}
          onClick={() => setViewMode('desktop')}
          title="Vista desktop"
        >🖥</button>
        <button
          className={`btn btn-icon${viewMode === 'mobile' ? ' btn-view-active' : ''}`}
          onClick={() => setViewMode('mobile')}
          title="Vista móvil"
        >📱</button>
      </div>

      <div className="topbar-divider" />

      <button
        className={`btn ${isPreviewMode ? 'btn-preview-active' : 'btn-ghost'}`}
        onClick={togglePreviewMode}
        title="Ver cómo queda tu página"
      >
        {isPreviewMode ? '✏️ Editar' : '👁 Preview'}
      </button>

      <button
        className="btn btn-ghost"
        onClick={resetBuilder}
        title="Cambiar de plantilla"
      >
        🔄 Cambiar
      </button>

      <button className="btn btn-accent" title="Publicar página (próximamente)">
        🚀 Publicar
      </button>
    </div>
  );
}
