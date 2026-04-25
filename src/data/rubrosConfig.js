// ─── Definición de bloques disponibles ───────────────────────────────────────
export const BLOCK_DEFINITIONS = {
  // Headers / Nav
  'header-minimal':  { label: 'Header Minimalista',  emoji: '🔲', category: 'headers', defaultW: 12, defaultH: 4 },
  'header-centered': { label: 'Header Centrado',     emoji: '⬛', category: 'headers', defaultW: 12, defaultH: 4 },
  'header-glass':    { label: 'Header Glass',        emoji: '💎', category: 'headers', defaultW: 12, defaultH: 4 },

  // Hero / Info
  banner:            { label: 'Hero / Banner',        emoji: '🖼️', category: 'info', defaultW: 12, defaultH: 6 },
  'hero-split':      { label: 'Hero Lado a Lado',    emoji: '↔️', category: 'info', defaultW: 12, defaultH: 7 },
  'stats-row':       { label: 'Estadísticas',        emoji: '📊', category: 'info', defaultW: 12, defaultH: 4 },
  bio:               { label: 'Texto / Descripción', emoji: '📝', category: 'info', defaultW: 8,  defaultH: 5 },
  avatar:            { label: 'Perfil / Avatar',     emoji: '👤', category: 'info', defaultW: 4,  defaultH: 6 },

  // Servicios / Catálogo
  'price-list':      { label: 'Lista de Precios',    emoji: '💰', category: 'servicios', defaultW: 8,  defaultH: 6 },
  'pricing-table':   { label: 'Tabla de Precios',    emoji: '🏷️', category: 'servicios', defaultW: 12, defaultH: 8 },
  'icon-grid':       { label: 'Grid de Iconos',      emoji: '🔷', category: 'servicios', defaultW: 12, defaultH: 7 },
  'benefit-list':    { label: 'Lista de Beneficios', emoji: '✅', category: 'servicios', defaultW: 6,  defaultH: 6 },
  'product-grid':    { label: 'Grilla de Productos', emoji: '🏪', category: 'servicios', defaultW: 12, defaultH: 8 },
  gallery:           { label: 'Galería de Fotos',    emoji: '📸', category: 'servicios', defaultW: 12, defaultH: 8 },

  // Contacto / Acción
  'whatsapp-cta':    { label: 'Botón WhatsApp',      emoji: '💬', category: 'cta',   defaultW: 12, defaultH: 4 },
  'social-links':    { label: 'Redes Sociales',      emoji: '🔗', category: 'cta',   defaultW: 12, defaultH: 3 },
  'coverage-text':   { label: 'Zona de Cobertura',   emoji: '📍', category: 'cta',   defaultW: 6,  defaultH: 4 },

  // Media
  'video-embed':     { label: 'Video',               emoji: '🎬', category: 'media', defaultW: 12, defaultH: 7 },
};

export const BLOCK_CATEGORIES = [
  { id: 'headers',   label: 'Headers',   emoji: '🔲' },
  { id: 'info',      label: 'Info',      emoji: '📄' },
  { id: 'servicios', label: 'Servicios', emoji: '⚙️' },
  { id: 'cta',       label: 'Contacto',  emoji: '📲' },
  { id: 'media',     label: 'Media',     emoji: '🎬' },
];

// ─── Templates por rubro ──────────────────────────────────────────────────────
const makeTpl = (id, name, description, previewClass, availableBlocks) =>
  ({ id, name, description, previewClass, availableBlocks });

export const RUBROS = [
  {
    id: 'productos',
    label: 'Productos',
    emoji: '🛍️',
    description: 'Catálogo visual, precios y métodos de pago',
    templates: [
      makeTpl('prod-moda', 'Moda & Indumentaria', 'Enfoque visual, galerías y grillas de producto', 'prev-blue', 
        ['header-minimal', 'banner', 'hero-split', 'gallery', 'product-grid', 'whatsapp-cta', 'social-links']),
      makeTpl('prod-tech', 'Tecnología & Gadgets', 'Enfoque técnico, tablas de precios, beneficios', 'prev-indigo', 
        ['header-centered', 'banner', 'pricing-table', 'benefit-list', 'icon-grid', 'product-grid', 'whatsapp-cta']),
      makeTpl('prod-artesanal', 'Artesanal & Emprendedor', 'Enfoque personal, biografía, catálogo simple', 'prev-pink', 
        ['header-glass', 'avatar', 'bio', 'product-grid', 'price-list', 'whatsapp-cta', 'social-links']),
    ],
  },
  {
    id: 'servicios',
    label: 'Servicios',
    emoji: '🔧',
    description: 'Presentá tus servicios, portfolio y tarifas',
    templates: [
      makeTpl('serv-consultoria', 'Consultoría & Negocios', 'Profesional, estadísticas, tablas de precios', 'prev-indigo', 
        ['header-centered', 'hero-split', 'stats-row', 'pricing-table', 'benefit-list', 'whatsapp-cta']),
      makeTpl('serv-salud', 'Salud & Belleza', 'Estética, lista de servicios, galería de resultados', 'prev-pink', 
        ['header-glass', 'banner', 'icon-grid', 'price-list', 'gallery', 'bio', 'whatsapp-cta']),
      makeTpl('serv-oficios', 'Oficios (Hogar)', 'Directo al grano, zona de cobertura, contacto rápido', 'prev-orange', 
        ['header-minimal', 'hero-split', 'benefit-list', 'coverage-text', 'price-list', 'whatsapp-cta', 'video-embed']),
    ],
  },
  {
    id: 'comida',
    label: 'Comida',
    emoji: '🍔',
    description: 'Mostrá tu menú, promociones y tomá pedidos al instante',
    templates: [
      makeTpl('comida-fast', 'Fast Food / Express', 'Impacto visual, grilla de menú dinámica', 'prev-orange', 
        ['header-centered', 'banner', 'product-grid', 'benefit-list', 'whatsapp-cta', 'social-links']),
      makeTpl('comida-cafe', 'Cafetería & Pastelería', 'Elegante, menú en lista, perfil del local', 'prev-yellow', 
        ['header-minimal', 'avatar', 'bio', 'price-list', 'gallery', 'whatsapp-cta', 'social-links']),
      makeTpl('comida-gourmet', 'Gourmet / Restó', 'Sofisticado, video de fondo, tabla de menú degustación', 'prev-teal', 
        ['header-glass', 'video-embed', 'bio', 'pricing-table', 'coverage-text', 'whatsapp-cta']),
    ],
  },
  {
    id: 'transporte',
    label: 'Transporte',
    emoji: '🚕',
    description: 'Mostrá tus tarifas, zona de cobertura y reserva',
    templates: [
      makeTpl('transp-chofer', 'Chofer Privado', 'Clásico, perfil del chofer, tarifas rápidas', 'prev-yellow', 
        ['header-centered', 'avatar', 'bio', 'price-list', 'whatsapp-cta', 'coverage-text']),
      makeTpl('transp-fletes', 'Fletes & Mudanzas', 'Práctico, estadísticas, beneficios de confianza', 'prev-blue', 
        ['header-minimal', 'banner', 'stats-row', 'benefit-list', 'pricing-table', 'whatsapp-cta']),
      makeTpl('transp-turismo', 'Traslados Turísticos', 'Vehículos en galería, zonas de cobertura', 'prev-green', 
        ['header-glass', 'hero-split', 'gallery', 'coverage-text', 'price-list', 'whatsapp-cta', 'social-links']),
    ],
  },
  {
    id: 'inmuebles',
    label: 'Inmuebles',
    emoji: '🏠',
    description: 'Catálogo de propiedades, alquileres y ventas',
    templates: [
      makeTpl('inm-agencia', 'Agencia Premium', 'Lujo, grilla de propiedades, perfil de agente', 'prev-teal', 
        ['header-glass', 'banner', 'avatar', 'product-grid', 'stats-row', 'whatsapp-cta']),
      makeTpl('inm-alquiler', 'Alquileres Rápidos', 'Tablas de precios, íconos de amenities', 'prev-blue', 
        ['header-centered', 'hero-split', 'icon-grid', 'pricing-table', 'gallery', 'whatsapp-cta']),
      makeTpl('inm-unica', 'Propiedad Única', 'Aterrizaje para una sola casa (video, galería inmersiva)', 'prev-green', 
        ['header-minimal', 'video-embed', 'gallery', 'icon-grid', 'coverage-text', 'whatsapp-cta']),
    ],
  },
  {
    id: 'turismo',
    label: 'Turismo',
    emoji: '🌴',
    description: 'Paseos, excursiones, guías y reservas',
    templates: [
      makeTpl('tur-aventura', 'Turismo Aventura', 'Videos, grilla de experiencias, beneficios', 'prev-green', 
        ['header-centered', 'video-embed', 'product-grid', 'benefit-list', 'whatsapp-cta', 'social-links']),
      makeTpl('tur-hotel', 'Hotel / Hospedaje', 'Íconos de servicios (amenities), grilla de habitaciones', 'prev-indigo', 
        ['header-glass', 'banner', 'icon-grid', 'product-grid', 'price-list', 'whatsapp-cta']),
      makeTpl('tur-agencia', 'Agencia de Viajes', 'Promociones en grilla, estadísticas, redes sociales', 'prev-pink', 
        ['header-minimal', 'hero-split', 'stats-row', 'product-grid', 'social-links', 'whatsapp-cta']),
    ],
  }
];
