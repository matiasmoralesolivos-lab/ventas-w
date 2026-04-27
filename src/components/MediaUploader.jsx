import { useRef, useState } from 'react';

const SERVER = import.meta.env.VITE_API_URL || '';

/**
 * MediaUploader — componente reutilizable para subir imágenes y/o videos.
 *
 * Props:
 *  - value:        URL actual del medio (string o null)
 *  - onChange:     fn(url, type) llamada cuando se sube o borra un archivo
 *  - accept:       'image' | 'video' | 'both'  (default: 'image')
 *  - label:        string de etiqueta
 *  - multiple:     bool — si permite múltiples archivos (llama onChange con array)
 *  - values:       array de URLs (modo multiple)
 *  - onChangeMultiple: fn(urls[]) en modo multiple
 */
export default function MediaUploader({
  value = null,
  onChange,
  accept = 'image',
  label = 'Subir imagen',
  multiple = false,
  values = [],
  onChangeMultiple,
}) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const acceptAttr =
    accept === 'image' ? 'image/*' :
    accept === 'video' ? 'video/*' :
    'image/*,video/*';

  async function uploadFiles(files) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      if (multiple) {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('files', f));
        const res = await fetch(`${SERVER}/api/upload-multiple`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error((await res.json()).error || 'Error al subir');
        const data = await res.json();
        const urls = data.files.map(f => f.url);
        onChangeMultiple && onChangeMultiple([...values, ...urls]);
      } else {
        const formData = new FormData();
        formData.append('file', files[0]);
        const res = await fetch(`${SERVER}/api/upload`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error((await res.json()).error || 'Error al subir');
        const data = await res.json();
        onChange && onChange(data.url, data.type);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e) {
    uploadFiles(e.target.files);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    uploadFiles(e.dataTransfer.files);
  }

  function handleRemove(url) {
    if (multiple) {
      onChangeMultiple && onChangeMultiple(values.filter(v => v !== url));
    } else {
      onChange && onChange(null, null);
    }
  }

  function isVideo(url) {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="media-uploader">
      {label && <label className="design-label">{label}</label>}

      {/* Drop zone */}
      <div
        className={`media-dropzone${dragging ? ' media-dropzone--over' : ''}${uploading ? ' media-dropzone--uploading' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
        {uploading ? (
          <div className="media-dropzone-placeholder">
            <div className="media-spinner" />
            <span>Subiendo…</span>
          </div>
        ) : (
          <div className="media-dropzone-placeholder">
            <span className="media-dropzone-icon">
              {accept === 'video' ? '🎬' : accept === 'both' ? '📎' : '🖼️'}
            </span>
            <span>Arrastrá o hacé clic para subir</span>
            <span className="media-dropzone-hint">
              {accept === 'image' ? 'JPG, PNG, WEBP, GIF' :
               accept === 'video' ? 'MP4, WEBM, MOV' :
               'Imágenes y videos — máx. 100 MB'}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="media-error">⚠️ {error}</p>
      )}

      {/* Preview — single */}
      {!multiple && value && (
        <div className="media-preview-single">
          {isVideo(value) ? (
            <video src={value} controls className="media-preview-media" />
          ) : (
            <img src={value} alt="Preview" className="media-preview-media" />
          )}
          <button
            className="media-preview-remove"
            onClick={e => { e.stopPropagation(); handleRemove(value); }}
            title="Quitar"
          >×</button>
        </div>
      )}

      {/* Preview — multiple */}
      {multiple && values.length > 0 && (
        <div className="media-preview-grid">
          {values.map((url, i) => (
            <div key={i} className="media-preview-thumb">
              {isVideo(url) ? (
                <video src={url} className="media-preview-thumb-media" />
              ) : (
                <img src={url} alt={`Media ${i + 1}`} className="media-preview-thumb-media" />
              )}
              <button
                className="media-preview-remove"
                onClick={() => handleRemove(url)}
                title="Quitar"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
