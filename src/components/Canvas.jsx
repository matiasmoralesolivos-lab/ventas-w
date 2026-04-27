import GridLayout from 'react-grid-layout';
import { useBuilderStore } from '../store/useBuilderStore';
import { BLOCK_DEFINITIONS } from '../data/rubrosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

function DraggableText({ blockId, elementKey, as = 'div', className, style, children, ...props }) {
  const { layout, updateItemContent, isPreviewMode } = useBuilderStore();
  const block = layout.find(b => b.i === blockId);
  const positions = block?.content?.positions || {};
  const pos = positions[elementKey] || { x: 0, y: 0 };
  const hasMoved = pos.x !== 0 || pos.y !== 0;

  const handleDragStart = () => {
    // Make the entire page cursor show 'grabbing' so it follows the mouse pointer
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = (e, info) => {
    document.body.style.cursor = '';
    const newX = pos.x + info.offset.x;
    const newY = pos.y + info.offset.y;
    updateItemContent(blockId, {
      positions: {
        ...positions,
        [elementKey]: { x: newX, y: newY }
      }
    });
  };

  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      drag={!isPreviewMode}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ top: -200, bottom: 200, left: -400, right: 400 }}
      animate={{ x: pos.x, y: pos.y }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={(e) => { if (!isPreviewMode) e.stopPropagation(); }}
      style={{ 
        position: 'relative',
        display: 'inline-block',
        zIndex: hasMoved ? 20 : 1,
        cursor: isPreviewMode ? 'default' : 'grab',
        userSelect: 'none',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%',
        ...style 
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}


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

function HeaderMinimalBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-header b-header-minimal" style={{ background: content.bgColor || undefined, color: content.textColor || undefined, position: 'relative' }}>
      {content.logoUrl && (
        <img src={content.logoUrl} alt="Logo" className="b-header-logo" style={{ maxWidth: '120px', maxHeight: '48px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
      )}
      {content.brand && (
        <DraggableText blockId={item.i} elementKey="brand" as="span" className="b-header-brand" style={{ color: content.textColor || undefined }}>{content.brand}</DraggableText>
      )}
      <nav className="b-header-nav">
        {(content.links || []).map((l, i) => <a key={i} href="#" style={{ color: content.textColor || undefined }}>{l}</a>)}
      </nav>
    </div>
  );
}

function HeaderCenteredBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-header b-header-centered" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.logoUrl && (
        <img src={content.logoUrl} alt="Logo" className="b-header-logo" style={{ maxWidth: '160px', maxHeight: '60px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
      )}
      {content.brand && (
        <DraggableText blockId={item.i} elementKey="brand" as="span" className="b-header-brand" style={{ color: content.textColor || undefined }}>{content.brand}</DraggableText>
      )}
      {content.tagline && <DraggableText blockId={item.i} elementKey="tagline" as="span" className="b-header-tagline" style={{ color: content.textColor || undefined }}>{content.tagline}</DraggableText>}
      <nav className="b-header-nav">
        {(content.links || []).map((l, i) => <a key={i} href="#" style={{ color: content.textColor || undefined }}>{l}</a>)}
      </nav>
    </div>
  );
}

function HeaderGlassBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-header b-header-glass" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.logoUrl && (
        <img src={content.logoUrl} alt="Logo" className="b-header-logo" style={{ maxWidth: '120px', maxHeight: '48px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', flexShrink: 0 }} />
      )}
      {content.brand && (
        <DraggableText blockId={item.i} elementKey="brand" as="span" className="b-header-brand" style={{ color: content.textColor || undefined }}>{content.brand}</DraggableText>
      )}
      <nav className="b-header-nav">
        {(content.links || []).map((l, i) => <a key={i} href="#" style={{ color: content.textColor || undefined }}>{l}</a>)}
      </nav>
    </div>
  );
}

function BannerBlock({ item }) {
  const content = item.content || {};
  // If a solid bgColor is set, use it; otherwise use gradient
  const bg = content.bgColor ? content.bgColor : (GRADIENTS[content.gradient] || GRADIENTS.blue);
  const textColor = content.textColor || '#ffffff';
  return (
    <div className="b-banner" style={{ background: content.imageUrl ? undefined : bg, position: 'relative', overflow: 'hidden' }}>
      {content.imageUrl && (
        <>
          <img src={content.imageUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1, pointerEvents:'none' }} />
        </>
      )}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', gap:8, padding:'16px' }}>
        <DraggableText blockId={item.i} elementKey="title" as="h1" style={{ color: textColor }}>{content.title}</DraggableText>
        {content.subtitle && <DraggableText blockId={item.i} elementKey="subtitle" as="p" style={{ color: textColor }}>{content.subtitle}</DraggableText>}
      </div>
    </div>
  );
}

function HeroSplitBlock({ item }) {
  const content = item.content || {};
  const bg = GRADIENTS[content.gradient] || GRADIENTS.blue;
  return (
    <div className="b-hero-split" style={{ background: bg }}>
      <div className="b-hero-split-text" style={{ position: 'relative' }}>
        {content.badge && <DraggableText blockId={item.i} elementKey="badge" as="span" className="b-hero-badge">{content.badge}</DraggableText>}
        <DraggableText blockId={item.i} elementKey="title" as="h2">{content.title}</DraggableText>
        <DraggableText blockId={item.i} elementKey="subtitle" as="p">{content.subtitle}</DraggableText>
        {content.cta && <button className="b-hero-cta">{content.cta}</button>}
      </div>
      <div className="b-hero-split-visual">
        {content.imageUrl ? (
          <img src={content.imageUrl} alt="Hero" className="b-hero-image" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
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

function StatsRowBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-stats" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {(content.items || []).map((item, i) => (
        <div key={i} className="b-stats-item">
          <DraggableText blockId={item.i} elementKey={`stats-value-${i}`} as="div" className="b-stats-value" style={{ color: content.textColor || undefined }}>{item.value}</DraggableText>
          <DraggableText blockId={item.i} elementKey={`stats-label-${i}`} as="div" className="b-stats-label" style={{ color: content.textColor ? `${content.textColor}bb` : undefined }}>{item.label}</DraggableText>
        </div>
      ))}
    </div>
  );
}

function AvatarBlock({ item }) {
  const content = item.content || {};

  return (
    <div className="b-avatar" style={{ position:'relative', color: content.textColor || undefined, background: content.bgColor || undefined }}>
      {content.bgImageUrl && (
        <img src={content.bgImageUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', zIndex:0 }} />
      )}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        {content.imageUrl ? (
          <img src={content.imageUrl} alt={content.name} className="b-avatar-img" style={{ objectFit:'cover', flexShrink:0 }} />
        ) : (
          <div className="b-avatar-img">👤</div>
        )}
        <DraggableText blockId={item.i} elementKey="name" as="h3" style={{ color: content.textColor || undefined }}>{content.name}</DraggableText>
        <DraggableText blockId={item.i} elementKey="subtitle" as="span" style={{ color: content.textColor || undefined }}>{content.subtitle}</DraggableText>
        {content.rating && (
          <div className="b-avatar-rating">{'★'.repeat(Math.round(content.rating))} {content.rating}</div>
        )}
      </div>
    </div>
  );
}

function PriceListBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-pricelist" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>{content.title}</DraggableText>
      {(content.items || []).map((it, i) => (
        <div key={i} className="b-pricelist-item">
          <DraggableText blockId={item.i} elementKey={`price-label-${i}`} as="span" style={{ color: content.textColor || undefined }}>{it.label || it.name}</DraggableText>
          <DraggableText blockId={item.i} elementKey={`price-val-${i}`} as="b" style={{ color: content.textColor || undefined }}>{it.price}</DraggableText>
        </div>
      ))}
    </div>
  );
}

function PricingTableBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-pricing-table" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>{content.title}</DraggableText>
      <div className="b-pricing-plans">
        {(content.plans || []).map((plan, i) => (
          <div key={i} className={`b-pricing-plan${plan.highlighted ? ' highlighted' : ''}`}>
            {plan.highlighted && <div className="b-pricing-badge">⭐ Más popular</div>}
            <DraggableText blockId={item.i} elementKey={`plan-name-${i}`} as="div" className="b-pricing-name" style={{ color: content.textColor || undefined }}>{plan.name}</DraggableText>
            <DraggableText blockId={item.i} elementKey={`plan-price-${i}`} as="div" className="b-pricing-price">{plan.price}</DraggableText>
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

function IconGridBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-icon-grid" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>{content.title}</DraggableText>
      <div className="b-icon-grid-inner">
        {(content.items || []).map((item, i) => (
          <div key={i} className="b-icon-card">
            <div className="b-icon-card-icon">{item.icon}</div>
            <DraggableText blockId={item.i} elementKey={`icon-label-${i}`} as="div" className="b-icon-card-label" style={{ color: content.textColor || undefined }}>{item.label}</DraggableText>
            <DraggableText blockId={item.i} elementKey={`icon-desc-${i}`} as="div" className="b-icon-card-desc" style={{ color: content.textColor ? `${content.textColor}bb` : undefined }}>{item.desc}</DraggableText>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenefitListBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-benefit" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>{content.title}</DraggableText>
      <ul className="b-benefit-list">
        {(content.items || []).map((item, i) => (
          <li key={i} className="b-benefit-item" style={{ color: content.textColor || undefined }}>
            <span className="b-benefit-check">✅</span>
            <DraggableText blockId={item.i} elementKey={`benefit-text-${i}`} as="span">{item.text}</DraggableText>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhatsAppBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-whatsapp">
      <span className="b-whatsapp-icon">💬</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <DraggableText blockId={item.i} elementKey="text" as="span">{content.text}</DraggableText>
        {content.phone && (
          <DraggableText blockId={item.i} elementKey="phone" as="div" style={{ fontSize: '15px', fontWeight: 600, color: '#fff', opacity: 0.9, marginTop: '-2px' }}>
            {content.phone}
          </DraggableText>
        )}
      </div>
    </div>
  );
}

function ProductGridBlock({ item }) {
  const content = item.content || {};
  const cols = content.columns || 3;
  const images = content.images || [];
  const placeholderCount = Math.max(0, cols * 2 - images.length);
  return (
    <div className="b-grid" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>{content.title}</DraggableText>
      <div className="b-grid-inner" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {images.map((url, i) => (
          <div key={i} className="b-grid-cell b-grid-cell--image">
            <img src={url} alt={`Producto ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          </div>
        ))}
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <div key={`ph-${i}`} className="b-grid-cell">🖼️</div>
        ))}
      </div>
    </div>
  );
}

function GalleryBlock({ item }) {
  const content = item.content || {};
  const cols = content.columns || 3;
  const colors = ['#e0e7ff','#fce7f3','#fef3c7','#d1fae5','#ffe4e6','#f0f9ff'];
  const media = content.images || [];
  const placeholderCount = Math.max(0, cols * 2 - media.length);
  return (
    <div className="b-gallery" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>{content.title}</DraggableText>
      <div className="b-gallery-inner" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {media.map((url, i) => {
          const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
          return (
            <div key={i} className="b-gallery-cell b-gallery-cell--media">
              {isVideo
                ? <video src={url} muted autoPlay loop playsInline style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                : <img src={url} alt={`Galería ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
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

function BioBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-bio" style={{ position:'relative', background: content.bgColor || undefined, color: content.textColor || undefined }}>
      {content.imageUrl && (
        <img src={content.imageUrl} alt={content.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', zIndex:0 }} />
      )}
      <div style={{ position:'relative', zIndex:1, padding:24 }}>
        <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || (content.imageUrl ? '#fff' : undefined) }}>{content.title}</DraggableText>
        <DraggableText blockId={item.i} elementKey="text" as="p" style={{ color: content.textColor || (content.imageUrl ? 'rgba(255,255,255,.85)' : undefined) }}>{content.text}</DraggableText>
      </div>
    </div>
  );
}

function SocialBlock({ item }) {
  const content = item.content || {};
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

function CoverageBlock({ item }) {
  const content = item.content || {};
  return (
    <div className="b-coverage" style={{ background: content.bgColor || undefined, color: content.textColor || undefined }}>
      <DraggableText blockId={item.i} elementKey="title" as="h3" style={{ color: content.textColor || undefined }}>📍 {content.title}</DraggableText>
      <div>
        {(content.zones || []).map((z, i) => (
          <span key={i} className="b-coverage-zone" style={{ color: content.textColor || undefined }}>📍 {z}</span>
        ))}
      </div>
    </div>
  );
}

function VideoBlock({ item }) {
  const content = item.content || {};
  const ytId = getYouTubeId(content.embedUrl);
  const viId = getVimeoId(content.embedUrl);

  if (ytId) {
    return (
      <div className="b-video">
        {content.title && <DraggableText blockId={item.i} elementKey="title" as="h3">{content.title}</DraggableText>}
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
        {content.title && <DraggableText blockId={item.i} elementKey="title" as="h3">{content.title}</DraggableText>}
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
        {content.title && <DraggableText blockId={item.i} elementKey="title" as="h3">{content.title}</DraggableText>}
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

function ImageOverlayBlock({ item }) {
  const content = item.content || {};
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
    <div className="b-image-overlay">
      {content.imageUrl && (
        <img src={content.imageUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block', zIndex:0 }} />
      )}
      <div className="b-image-overlay-shade" style={{ background: `rgba(${r},${g},${b},${overlayOpacity})`, zIndex:1 }} />
      <div className="b-image-overlay-content" style={{ alignItems: pos.alignItems, justifyContent: pos.justifyContent, textAlign: pos.textAlign, zIndex:2 }}>
        {content.title && <DraggableText blockId={item.i} elementKey="title" as="h2" className="b-image-overlay-title">{content.title}</DraggableText>}
        {content.subtitle && <DraggableText blockId={item.i} elementKey="subtitle" as="p" className="b-image-overlay-sub">{content.subtitle}</DraggableText>}
        {content.cta && <button className="b-image-overlay-cta">{content.cta}</button>}
      </div>
    </div>
  );
}

function renderBlock(item) {
  const c = item.content || {};
  switch (item.type) {
    case 'header-minimal':  return <HeaderMinimalBlock item={item} />;
    case 'header-centered': return <HeaderCenteredBlock item={item} />;
    case 'header-glass':    return <HeaderGlassBlock item={item} />;
    case 'banner':          return <BannerBlock item={item} />;
    case 'hero-split':      return <HeroSplitBlock item={item} />;
    case 'image-overlay':   return <ImageOverlayBlock item={item} />;
    case 'stats-row':       return <StatsRowBlock item={item} />;
    case 'avatar':          return <AvatarBlock item={item} />;
    case 'price-list':      return <PriceListBlock item={item} />;
    case 'pricing-table':   return <PricingTableBlock item={item} />;
    case 'icon-grid':       return <IconGridBlock item={item} />;
    case 'benefit-list':    return <BenefitListBlock item={item} />;
    case 'whatsapp-cta':    return <WhatsAppBlock item={item} />;
    case 'product-grid':    return <ProductGridBlock item={item} />;
    case 'gallery':         return <GalleryBlock item={item} />;
    case 'bio':             return <BioBlock item={item} />;
    case 'social-links':    return <SocialBlock item={item} />;
    case 'coverage-text':   return <CoverageBlock item={item} />;
    case 'video-embed':     return <VideoBlock item={item} />;
    default: return <div style={{ background:'#f8fafc', height:'100%', borderRadius:8, border:'2px dashed #e2e8f0' }} />;
  }
}

// ─── Toast notification ──────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        color: '#fff', padding: '10px 22px', borderRadius: 40,
        fontWeight: 600, fontSize: 14, zIndex: 9999,
        boxShadow: '0 8px 32px rgba(99,102,241,.45)',
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}
    >
      {message}
    </motion.div>
  );
}

// ─── Canvas principal ──────────────────────────────────────────────────────────

export default function Canvas() {
  const {
    layout, updateLayout, removeItem, selectItem, selectedItemId,
    isPreviewMode, viewMode, draggingType, addElement, setDraggingType,
  } = useBuilderStore();

  const [toast, setToast] = useState(null);
  const prevLayoutLen = useRef(layout.length);
  const lastItemRef = useRef(null);

  // Auto-scroll + toast when a block is added
  useEffect(() => {
    if (layout.length > prevLayoutLen.current) {
      const added = layout[layout.length - 1];
      const def = BLOCK_DEFINITIONS[added?.type];
      if (def) {
        setToast(`✅ Bloque "${def.label}" agregado`);
        // scroll the new block into view
        setTimeout(() => {
          if (lastItemRef.current) {
            lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 80);
      }
    }
    prevLayoutLen.current = layout.length;
  }, [layout.length]);

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

  // Drop on empty canvas
  function handleEmptyDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer?.getData('blockType') || draggingType;
    if (!type) return;
    setDraggingType(null);
    addElement(type, { x: 0, y: 0 });
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
  const { width: paperWidth } = VIEW_CONFIG[viewMode] || VIEW_CONFIG.desktop;

  return (
    <>
      <div
        className={`canvas-area${draggingType ? ' canvas-dropping' : ''}`}
        onClick={() => selectItem(null)}
        onDragOver={handleDragOver}
      >
        <div className={`canvas-paper canvas-paper--${viewMode}`}
          style={{ width: paperWidth }}
        >
          {layout.length === 0 ? (
            <div
              className={`canvas-empty${draggingType ? ' canvas-empty--active' : ''}`}
              onDrop={handleEmptyDrop}
              onDragOver={handleDragOver}
            >
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
              {layout.map((item, idx) => {
                const isSelected = selectedItemId === item.i;
                const isLast = idx === layout.length - 1;
                return (
                  <div
                    key={item.i}
                    ref={isLast ? lastItemRef : null}
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

      {/* Toast portal */}
      <AnimatePresence>
        {toast && <Toast key={toast} message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
}