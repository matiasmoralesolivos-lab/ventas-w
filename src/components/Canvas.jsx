import GridLayout from 'react-grid-layout';
import { useBuilderStore } from '../store/useBuilderStore';
import { BLOCK_DEFINITIONS } from '../data/rubrosConfig';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

// ─── Gradients ────────────────────────────────────────────────────────────────
const GRADIENTS = {
  blue:   'linear-gradient(135deg,#3b82f6,#6366f1)',
  gold:   'linear-gradient(135deg,#f59e0b,#ef4444)',
  orange: 'linear-gradient(135deg,#f97316,#ef4444)',
  red:    'linear-gradient(135deg,#ef4444,#dc2626)',
  purple: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
  pink:   'linear-gradient(135deg,#ec4899,#f43f5e)',
  teal:   'linear-gradient(135deg,#14b8a6,#3b82f6)',
  indigo: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  dark:   'linear-gradient(135deg,#1e293b,#0f172a)',
  green:  'linear-gradient(135deg,#22c55e,#14b8a6)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

function getVimeoId(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

// ─── Bloques ──────────────────────────────────────────────────────────────────

function HeaderMinimalBlock({ content }) {
  return (
    <div className="b-header b-header-minimal" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.logoUrl
        ? <img src={content.logoUrl} alt="Logo" className="b-header-logo" />
        : <span className="b-header-brand" style={{ color: content.textColor || undefined }}>{content.brand}</span>
      }
      <nav className="b-header-nav">
        {(content.links || []).map((l, i) => <a key={i} href="#" style={{ color: content.textColor || undefined }}>{l}</a>)}
      </nav>
    </div>
  );
}

function HeaderCenteredBlock({ content }) {
  return (
    <div className="b-header b-header-centered" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.logoUrl
        ? <img src={content.logoUrl} alt="Logo" className="b-header-logo" />
        : <span className="b-header-brand" style={{ color: content.textColor || undefined }}>{content.brand}</span>
      }
      {content.tagline && <span className="b-header-tagline" style={{ color: content.textColor || undefined }}>{content.tagline}</span>}
      <nav className="b-header-nav">
        {(content.links || []).map((l, i) => <a key={i} href="#" style={{ color: content.textColor || undefined }}>{l}</a>)}
      </nav>
    </div>
  );
}

function HeaderGlassBlock({ content }) {
  return (
    <div className="b-header b-header-glass" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.logoUrl
        ? <img src={content.logoUrl} alt="Logo" className="b-header-logo" />
        : <span className="b-header-brand" style={{ color: content.textColor || undefined }}>{content.brand}</span>
      }
      <nav className="b-header-nav">
        {(content.links || []).map((l, i) => <a key={i} href="#" style={{ color: content.textColor || undefined }}>{l}</a>)}
      </nav>
    </div>
  );
}

function BannerBlock({ content }) {
  const bg = GRADIENTS[content.gradient] || GRADIENTS.blue;
  return (
    <div className="b-banner" style={{ background: bg }}>
      <h1>{content.title}</h1>
      {content.subtitle && <p>{content.subtitle}</p>}
    </div>
  );
}

function HeroSplitBlock({ content }) {
  const bg = GRADIENTS[content.gradient] || GRADIENTS.blue;
  return (
    <div className="b-hero-split" style={{ background: bg }}>
      <div className="b-hero-split-text">
        {content.badge && <span className="b-hero-badge">{content.badge}</span>}
        <h2>{content.title}</h2>
        <p>{content.subtitle}</p>
        {content.cta && <button className="b-hero-cta">{content.cta}</button>}
      </div>
      <div className="b-hero-split-visual">
        {content.imageUrl ? (
          <img src={content.imageUrl} alt="Hero" className="b-hero-image" />
        ) : (
          <div className="b-hero-visual-card">
            <div className="b-hero-visual-icon">🚀</div>
            <span>Tu servicio</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsRowBlock({ content }) {
  return (
    <div className="b-stats" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {(content.items || []).map((item, i) => (
        <div key={i} className="b-stats-item">
          <div className="b-stats-value" style={{ color: content.textColor || undefined }}>{item.value}</div>
          <div className="b-stats-label" style={{ color: content.textColor ? `${content.textColor}bb` : undefined }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function AvatarBlock({ content }) {
  return (
    <div className="b-avatar" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.imageUrl ? (
        <img src={content.imageUrl} alt={content.name} className="b-avatar-img-real" />
      ) : (
        <div className="b-avatar-img">👤</div>
      )}
      <h3 style={{ color: content.textColor || undefined }}>{content.name}</h3>
      <span style={{ color: content.textColor || undefined }}>{content.subtitle}</span>
      {content.rating && (
        <div className="b-avatar-rating">
          {'★'.repeat(Math.round(content.rating))} {content.rating}
        </div>
      )}
    </div>
  );
}

function PriceListBlock({ content }) {
  return (
    <div className="b-pricelist" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      {(content.items || []).map((item, i) => (
        <div key={i} className="b-pricelist-item">
          <span style={{ color: content.textColor || undefined }}>{item.label}</span>
          <b style={{ color: content.textColor || undefined }}>{item.price}</b>
        </div>
      ))}
    </div>
  );
}

function PricingTableBlock({ content }) {
  return (
    <div className="b-pricing-table" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      <div className="b-pricing-plans">
        {(content.plans || []).map((plan, i) => (
          <div key={i} className={`b-pricing-plan${plan.highlighted ? ' highlighted' : ''}`}>
            {plan.highlighted && <div className="b-pricing-badge">⭐ Más popular</div>}
            <div className="b-pricing-name" style={{ color: content.textColor || undefined }}>{plan.name}</div>
            <div className="b-pricing-price">{plan.price}</div>
            <ul className="b-pricing-features">
              {(plan.features || []).map((f, j) => <li key={j} style={{ color: content.textColor || undefined }}>✓ {f}</li>)}
            </ul>
            <button className="b-pricing-cta">{plan.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconGridBlock({ content }) {
  return (
    <div className="b-icon-grid" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      <div className="b-icon-grid-inner">
        {(content.items || []).map((item, i) => (
          <div key={i} className="b-icon-card">
            <div className="b-icon-card-icon">{item.icon}</div>
            <div className="b-icon-card-label" style={{ color: content.textColor || undefined }}>{item.label}</div>
            <div className="b-icon-card-desc" style={{ color: content.textColor ? `${content.textColor}bb` : undefined }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenefitListBlock({ content }) {
  return (
    <div className="b-benefit" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      <ul className="b-benefit-list">
        {(content.items || []).map((item, i) => (
          <li key={i} className="b-benefit-item" style={{ color: content.textColor || undefined }}>
            <span className="b-benefit-check">✅</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhatsAppBlock({ content }) {
  return (
    <div className="b-whatsapp">
      <span className="b-whatsapp-icon">💬</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span>{content.text}</span>
        {content.phone && (
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', opacity: 0.9, marginTop: '-2px' }}>
            {content.phone}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductGridBlock({ content }) {
  const cols = content.columns || 3;
  const images = content.images || [];
  const placeholderCount = Math.max(0, cols * 2 - images.length);
  return (
    <div className="b-grid" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      <div className="b-grid-inner" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {images.map((url, i) => (
          <div key={i} className="b-grid-cell b-grid-cell--image">
            <img src={url} alt={`Producto ${i+1}`} />
          </div>
        ))}
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <div key={`ph-${i}`} className="b-grid-cell">🖼️</div>
        ))}
      </div>
    </div>
  );
}

function GalleryBlock({ content }) {
  const cols = content.columns || 3;
  const colors = ['#e0e7ff','#fce7f3','#fef3c7','#d1fae5','#ffe4e6','#f0f9ff'];
  const media = content.images || [];
  const placeholderCount = Math.max(0, cols * 2 - media.length);
  return (
    <div className="b-gallery" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      <div className="b-gallery-inner" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {media.map((url, i) => {
          const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
          return (
            <div key={i} className="b-gallery-cell b-gallery-cell--media">
              {isVideo
                ? <video src={url} muted autoPlay loop playsInline />
                : <img src={url} alt={`Galería ${i+1}`} />
              }
            </div>
          );
        })}
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <div key={`ph-${i}`} className="b-gallery-cell" style={{ background: colors[i % colors.length] }}>📷</div>
        ))}
      </div>
    </div>
  );
}

function BioBlock({ content }) {
  return (
    <div className="b-bio" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.imageUrl && (
        <img src={content.imageUrl} alt={content.title} className="b-bio-image" />
      )}
      <h3 style={{ color: content.textColor || undefined }}>{content.title}</h3>
      <p style={{ color: content.textColor || undefined }}>{content.text}</p>
    </div>
  );
}

function SocialBlock({ content }) {
  const colors = { Instagram: '#e1306c', Facebook: '#1877f2', Twitter: '#1da1f2', TikTok: '#000', YouTube: '#ff0000', LinkedIn: '#0077b5' };
  return (
    <div className="b-social">
      {(content.links || []).map((l, i) => (
        <div key={i} className="b-social-pill" style={{ background: colors[l.platform] || '#6366f1' }}>
          {l.platform}
        </div>
      ))}
    </div>
  );
}

function CoverageBlock({ content }) {
  return (
    <div className="b-coverage" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <h3 style={{ color: content.textColor || undefined }}>📍 {content.title}</h3>
      <div>
        {(content.zones || []).map((z, i) => (
          <span key={i} className="b-coverage-zone" style={{ color: content.textColor || undefined }}>📍 {z}</span>
        ))}
      </div>
    </div>
  );
}

function VideoBlock({ content }) {
  const ytId = getYouTubeId(content.embedUrl);
  const viId = getVimeoId(content.embedUrl);

  if (ytId) {
    return (
      <div className="b-video">
        {content.title && <h3>{content.title}</h3>}
        <div className="b-video-embed">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={content.title || 'YouTube video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (viId) {
    return (
      <div className="b-video">
        {content.title && <h3>{content.title}</h3>}
        <div className="b-video-embed">
          <iframe
            src={`https://player.vimeo.com/video/${viId}`}
            title={content.title || 'Vimeo video'}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (content.videoUrl) {
    return (
      <div className="b-video">
        {content.title && <h3>{content.title}</h3>}
        <video
          src={content.videoUrl}
          controls
          className="b-video-native"
        />
      </div>
    );
  }

  return (
    <div className="b-video b-video--placeholder">
      <div className="b-video-icon">🎬</div>
      <span>Seleccioná este bloque para agregar un video</span>
    </div>
  );
}

function ImageOverlayBlock({ content }) {
  const posMap = {
    'top-left':     { alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'left' },
    'top-center':   { alignItems: 'flex-start', justifyContent: 'center',     textAlign: 'center' },
    'top-right':    { alignItems: 'flex-start', justifyContent: 'flex-end',   textAlign: 'right' },
    'center-left':  { alignItems: 'center',     justifyContent: 'flex-start', textAlign: 'left' },
    'center':       { alignItems: 'center',     justifyContent: 'center',     textAlign: 'center' },
    'center-right': { alignItems: 'center',     justifyContent: 'flex-end',   textAlign: 'right' },
    'bottom-left':  { alignItems: 'flex-end',   justifyContent: 'flex-start', textAlign: 'left' },
    'bottom-center':{ alignItems: 'flex-end',   justifyContent: 'center',     textAlign: 'center' },
    'bottom-right': { alignItems: 'flex-end',   justifyContent: 'flex-end',   textAlign: 'right' },
  };
  const pos = posMap[content.textPosition] || posMap['center'];
  const overlayColor = content.overlayColor || '#000000';
  const overlayOpacity = content.overlayOpacity ?? 0.5;
  const r = parseInt(overlayColor.slice(1,3),16);
  const g = parseInt(overlayColor.slice(3,5),16);
  const b = parseInt(overlayColor.slice(5,7),16);

  return (
    <div className="b-image-overlay" style={{
      backgroundImage: content.imageUrl ? `url(${content.imageUrl})` : undefined,
    }}>
      <div className="b-image-overlay-shade" style={{
        background: `rgba(${r},${g},${b},${overlayOpacity})`,
      }} />
      <div className="b-image-overlay-content" style={{
        alignItems: pos.alignItems,
        justifyContent: pos.justifyContent,
        textAlign: pos.textAlign,
      }}>
        {content.title && <h2 className="b-image-overlay-title">{content.title}</h2>}
        {content.subtitle && <p className="b-image-overlay-sub">{content.subtitle}</p>}
        {content.cta && <button className="b-image-overlay-cta">{content.cta}</button>}
      </div>
    </div>
  );
}

function renderBlock(item) {
  const c = item.content || {};
  switch (item.type) {
    case 'header-minimal':  return <HeaderMinimalBlock content={c} />;
    case 'header-centered': return <HeaderCenteredBlock content={c} />;
    case 'header-glass':    return <HeaderGlassBlock content={c} />;
    case 'banner':          return <BannerBlock content={c} />;
    case 'hero-split':      return <HeroSplitBlock content={c} />;
    case 'image-overlay':   return <ImageOverlayBlock content={c} />;
    case 'stats-row':       return <StatsRowBlock content={c} />;
    case 'avatar':          return <AvatarBlock content={c} />;
    case 'price-list':      return <PriceListBlock content={c} />;
    case 'pricing-table':   return <PricingTableBlock content={c} />;
    case 'icon-grid':       return <IconGridBlock content={c} />;
    case 'benefit-list':    return <BenefitListBlock content={c} />;
    case 'whatsapp-cta':    return <WhatsAppBlock content={c} />;
    case 'product-grid':    return <ProductGridBlock content={c} />;
    case 'gallery':         return <GalleryBlock content={c} />;
    case 'bio':             return <BioBlock content={c} />;
    case 'social-links':    return <SocialBlock content={c} />;
    case 'coverage-text':   return <CoverageBlock content={c} />;
    case 'video-embed':     return <VideoBlock content={c} />;
    default: return <div style={{ background:'#f8fafc', height:'100%', borderRadius:8, border:'2px dashed #e2e8f0' }} />;
  }
}

// ─── Canvas principal ──────────────────────────────────────────────────────────

export default function Canvas() {
  const {
    layout, updateLayout, removeItem, selectItem, selectedItemId,
    isPreviewMode, viewMode, draggingType, addElement, setDraggingType,
  } = useBuilderStore();

  const def = draggingType ? BLOCK_DEFINITIONS[draggingType] : null;
  const droppingItem = def
    ? { i: '__dropping__', w: def.defaultW, h: def.defaultH }
    : undefined;

  function handleSelect(e, id) {
    e.stopPropagation();
    selectItem(id);
  }

  function handleDrop(_, item, e) {
    const type = e?.dataTransfer?.getData('blockType') || draggingType;
    if (!type) return;
    setDraggingType(null);
    addElement(type, { x: item.x, y: item.y });
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  const VIEW_CONFIG = {
    desktop: { width: 960,  label: '🖥 Desktop',  hint: '960px' },
    tablet:  { width: 768,  label: '📟 Tablet',   hint: '768px' },
    mobile:  { width: 390,  label: '📱 Móvil',    hint: '390px' },
    smarttv: { width: 1920, label: '📺 Smart TV', hint: '1920px' },
  };
  const { width: paperWidth, label: deviceLabel, hint: deviceHint } = VIEW_CONFIG[viewMode] || VIEW_CONFIG.desktop;

  return (
    <div
      className={`canvas-area${draggingType ? ' canvas-dropping' : ''}`}
      onClick={() => selectItem(null)}
      onDragOver={handleDragOver}
    >
      {/* Device frame indicator */}
      <div className="canvas-device-bar">
        <span className="canvas-device-label">{deviceLabel}</span>
        <span className="canvas-device-hint">{deviceHint}</span>
      </div>

      <div
        className={`canvas-paper canvas-paper--${viewMode}`}
        style={{ width: paperWidth }}
      >
        {layout.length === 0 ? (
          <div className="canvas-empty">
            <div className="canvas-empty-icon">🎨</div>
            <p>Tu página está en blanco.</p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              {draggingType ? '¡Soltá aquí para agregar!' : 'Arrastrá o hacé clic en un bloque →'}
            </p>
          </div>
        ) : (
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={40}
            width={paperWidth}
            onLayoutChange={updateLayout}
            draggableHandle=".drag-handle"
            margin={[0, 0]}
            isDraggable={!isPreviewMode}
            isResizable={!isPreviewMode}
            isDroppable={!isPreviewMode}
            droppingItem={droppingItem}
            onDrop={handleDrop}
          >
            {layout.map((item) => {
              const isSelected = selectedItemId === item.i;
              return (
                <div
                  key={item.i}
                  onClick={(e) => !isPreviewMode && handleSelect(e, item.i)}
                  style={{ cursor: isPreviewMode ? 'default' : 'pointer' }}
                >
                  <div
                    className={`block-wrapper${isSelected ? ' block-selected' : ''}`}
                  >
                    {!isPreviewMode && (
                      <div className="block-controls">
                        <button
                          className="block-ctrl-btn block-ctrl-drag drag-handle"
                          title="Mover"
                        >⠿</button>
                        <button
                          className="block-ctrl-btn block-ctrl-del"
                          onClick={(e) => { e.stopPropagation(); removeItem(item.i); }}
                          title="Eliminar bloque"
                        >×</button>
                      </div>
                    )}
                    {renderBlock(item)}
                  </div>
                </div>
              );
            })}
          </GridLayout>
        )}
      </div>
    </div>
  );
}