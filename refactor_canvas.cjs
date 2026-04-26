const fs = require('fs');
const file = 'd:/anti/waup/src/components/Canvas.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add framer-motion and DraggableText
const imports = `import GridLayout from 'react-grid-layout';
import { useBuilderStore } from '../store/useBuilderStore';
import { BLOCK_DEFINITIONS } from '../data/rubrosConfig';
import { motion } from 'framer-motion';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

function DraggableText({ blockId, elementKey, as = 'div', className, style, children, ...props }) {
  const { layout, updateItemContent, isPreviewMode } = useBuilderStore();
  const block = layout.find(b => b.i === blockId);
  const positions = block?.content?.positions || {};
  const pos = positions[elementKey] || { x: 0, y: 0 };

  const handleDragEnd = (e, info) => {
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
      animate={{ x: pos.x, y: pos.y }}
      onDragEnd={handleDragEnd}
      style={{ 
        position: 'relative', 
        zIndex: (pos.x !== 0 || pos.y !== 0) ? 10 : 1, 
        cursor: isPreviewMode ? 'default' : 'grab',
        display: 'inline-block',
        ...style 
      }}
      whileDrag={{ cursor: 'grabbing', zIndex: 999 }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}`;

code = code.replace(/import GridLayout from 'react-grid-layout';[\s\S]*?import '\/node_modules\/react-resizable\/css\/styles\.css';/, imports);

// 2. Refactor Blocks
code = code.replace(/function HeaderMinimalBlock\(\{ content \}\) \{/, 'function HeaderMinimalBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<span className=\"b-header-brand\"(.*?)>\{content\.brand\}<\/span>/, '<DraggableText blockId={item.i} elementKey="brand" as="span" className="b-header-brand"$1>{content.brand}</DraggableText>');

code = code.replace(/function HeaderCenteredBlock\(\{ content \}\) \{/, 'function HeaderCenteredBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<span className=\"b-header-tagline\"(.*?)>\{content\.tagline\}<\/span>/, '<DraggableText blockId={item.i} elementKey="tagline" as="span" className="b-header-tagline"$1>{content.tagline}</DraggableText>');

code = code.replace(/function HeaderGlassBlock\(\{ content \}\) \{/, 'function HeaderGlassBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function BannerBlock\(\{ content \}\) \{/, 'function BannerBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<h1>\{content\.title\}<\/h1>/, '<DraggableText blockId={item.i} elementKey="title" as="h1">{content.title}</DraggableText>');
code = code.replace(/<p>\{content\.subtitle\}<\/p>/, '<DraggableText blockId={item.i} elementKey="subtitle" as="p">{content.subtitle}</DraggableText>');

code = code.replace(/function HeroSplitBlock\(\{ content \}\) \{/, 'function HeroSplitBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<h2>\{content\.title\}<\/h2>/, '<DraggableText blockId={item.i} elementKey="title" as="h2">{content.title}</DraggableText>');
code = code.replace(/<p>\{content\.subtitle\}<\/p>/, '<DraggableText blockId={item.i} elementKey="subtitle" as="p">{content.subtitle}</DraggableText>');
code = code.replace(/<span className=\"b-hero-badge\">\{content\.badge\}<\/span>/, '<DraggableText blockId={item.i} elementKey="badge" as="span" className="b-hero-badge">{content.badge}</DraggableText>');

code = code.replace(/function StatsRowBlock\(\{ content \}\) \{/, 'function StatsRowBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<div className=\"b-stats-value\"(.*?)>\{item\.value\}<\/div>/g, '<DraggableText blockId={item.i} elementKey={`stats-value-${i}`} as="div" className="b-stats-value"$1>{item.value}</DraggableText>');
code = code.replace(/<div className=\"b-stats-label\"(.*?)>\{item\.label\}<\/div>/g, '<DraggableText blockId={item.i} elementKey={`stats-label-${i}`} as="div" className="b-stats-label"$1>{item.label}</DraggableText>');

code = code.replace(/function AvatarBlock\(\{ content \}\) \{/, 'function AvatarBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<h3(.*?)>\{content\.name\}<\/h3>/, '<DraggableText blockId={item.i} elementKey="name" as="h3"$1>{content.name}</DraggableText>');
code = code.replace(/<span(.*?)>\{content\.subtitle\}<\/span>/, '<DraggableText blockId={item.i} elementKey="subtitle" as="span"$1>{content.subtitle}</DraggableText>');

code = code.replace(/function PriceListBlock\(\{ content \}\) \{/, 'function PriceListBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<h3(.*?)>\{content\.title\}<\/h3>/, '<DraggableText blockId={item.i} elementKey="title" as="h3"$1>{content.title}</DraggableText>');
code = code.replace(/<span(.*?)>\{item\.label\}<\/span>/g, '<DraggableText blockId={item.i} elementKey={`price-label-${i}`} as="span"$1>{item.label}</DraggableText>');
code = code.replace(/<b(.*?)>\{item\.price\}<\/b>/g, '<DraggableText blockId={item.i} elementKey={`price-val-${i}`} as="b"$1>{item.price}</DraggableText>');

code = code.replace(/function PricingTableBlock\(\{ content \}\) \{/, 'function PricingTableBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function IconGridBlock\(\{ content \}\) \{/, 'function IconGridBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<div className=\"b-icon-card-label\"(.*?)>\{item\.label\}<\/div>/g, '<DraggableText blockId={item.i} elementKey={`icon-label-${i}`} as="div" className="b-icon-card-label"$1>{item.label}</DraggableText>');
code = code.replace(/<div className=\"b-icon-card-desc\"(.*?)>\{item\.desc\}<\/div>/g, '<DraggableText blockId={item.i} elementKey={`icon-desc-${i}`} as="div" className="b-icon-card-desc"$1>{item.desc}</DraggableText>');

code = code.replace(/function BenefitListBlock\(\{ content \}\) \{/, 'function BenefitListBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function WhatsAppBlock\(\{ content \}\) \{/, 'function WhatsAppBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<span>\{content\.text\}<\/span>/, '<DraggableText blockId={item.i} elementKey="text" as="span">{content.text}</DraggableText>');

code = code.replace(/function ProductGridBlock\(\{ content \}\) \{/, 'function ProductGridBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function GalleryBlock\(\{ content \}\) \{/, 'function GalleryBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function BioBlock\(\{ content \}\) \{/, 'function BioBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<p(.*?)>\{content\.text\}<\/p>/, '<DraggableText blockId={item.i} elementKey="text" as="p"$1>{content.text}</DraggableText>');

code = code.replace(/function SocialBlock\(\{ content \}\) \{/, 'function SocialBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function CoverageBlock\(\{ content \}\) \{/, 'function CoverageBlock({ item }) {\n  const content = item.content || {};');

code = code.replace(/function VideoBlock\(\{ content \}\) \{/, 'function VideoBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<h3>\{content\.title\}<\/h3>/g, '<DraggableText blockId={item.i} elementKey="title" as="h3">{content.title}</DraggableText>');

code = code.replace(/function ImageOverlayBlock\(\{ content \}\) \{/, 'function ImageOverlayBlock({ item }) {\n  const content = item.content || {};');
code = code.replace(/<h2 className=\"b-image-overlay-title\">\{content\.title\}<\/h2>/, '<DraggableText blockId={item.i} elementKey="title" as="h2" className="b-image-overlay-title">{content.title}</DraggableText>');
code = code.replace(/<p className=\"b-image-overlay-sub\">\{content\.subtitle\}<\/p>/, '<DraggableText blockId={item.i} elementKey="subtitle" as="p" className="b-image-overlay-sub">{content.subtitle}</DraggableText>');

// Replace renderBlock calls
code = code.replace(/<HeaderMinimalBlock content=\{c\} \/>/, '<HeaderMinimalBlock item={item} />');
code = code.replace(/<HeaderCenteredBlock content=\{c\} \/>/, '<HeaderCenteredBlock item={item} />');
code = code.replace(/<HeaderGlassBlock content=\{c\} \/>/, '<HeaderGlassBlock item={item} />');
code = code.replace(/<BannerBlock content=\{c\} \/>/, '<BannerBlock item={item} />');
code = code.replace(/<HeroSplitBlock content=\{c\} \/>/, '<HeroSplitBlock item={item} />');
code = code.replace(/<ImageOverlayBlock content=\{c\} \/>/, '<ImageOverlayBlock item={item} />');
code = code.replace(/<StatsRowBlock content=\{c\} \/>/, '<StatsRowBlock item={item} />');
code = code.replace(/<AvatarBlock content=\{c\} \/>/, '<AvatarBlock item={item} />');
code = code.replace(/<PriceListBlock content=\{c\} \/>/, '<PriceListBlock item={item} />');
code = code.replace(/<PricingTableBlock content=\{c\} \/>/, '<PricingTableBlock item={item} />');
code = code.replace(/<IconGridBlock content=\{c\} \/>/, '<IconGridBlock item={item} />');
code = code.replace(/<BenefitListBlock content=\{c\} \/>/, '<BenefitListBlock item={item} />');
code = code.replace(/<WhatsAppBlock content=\{c\} \/>/, '<WhatsAppBlock item={item} />');
code = code.replace(/<ProductGridBlock content=\{c\} \/>/, '<ProductGridBlock item={item} />');
code = code.replace(/<GalleryBlock content=\{c\} \/>/, '<GalleryBlock item={item} />');
code = code.replace(/<BioBlock content=\{c\} \/>/, '<BioBlock item={item} />');
code = code.replace(/<SocialBlock content=\{c\} \/>/, '<SocialBlock item={item} />');
code = code.replace(/<CoverageBlock content=\{c\} \/>/, '<CoverageBlock item={item} />');
code = code.replace(/<VideoBlock content=\{c\} \/>/, '<VideoBlock item={item} />');

// 3. Remove Device Bar
code = code.replace(/\{\/\* Device frame indicator \*\/\}[\s\S]*?<\/div>\s*<div\s*className=\{\`canvas-paper/, '<div className={`canvas-paper');

fs.writeFileSync(file, code);
