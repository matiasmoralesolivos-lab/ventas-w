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
const makeTpl = (id, name, description, previewClass, layout) =>
  ({ id, name, description, previewClass, layout });

export const RUBROS = [
  {
    id: 'taxi',
    label: 'Taxi / Transporte',
    emoji: '🚕',
    description: 'Mostrá tus tarifas, zona de cobertura y contacto directo',
    availableBlocks: ['header-minimal', 'banner', 'avatar', 'price-list', 'whatsapp-cta', 'coverage-text', 'social-links', 'video-embed'],
    templates: [
      makeTpl('taxi-clasica', 'Clásica', 'Banner + perfil + tarifas', 'prev-yellow', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 6, type: 'banner',       content: { title: 'Tu Taxi de Confianza', subtitle: 'Seguro, puntual y cómodo', gradient: 'gold' } },
        { i: 't2', x: 0, y: 6,  w: 4,  h: 7, type: 'avatar',       content: { name: 'Juan Pérez', subtitle: 'Conductor profesional', rating: 4.8 } },
        { i: 't3', x: 4, y: 6,  w: 8,  h: 7, type: 'price-list',   content: { title: 'Tarifas', items: [{ label: 'Zona Centro', price: '$800' }, { label: 'Aeropuerto', price: '$2.500' }, { label: 'Por hora', price: '$1.200' }] } },
        { i: 't4', x: 0, y: 13, w: 12, h: 4, type: 'whatsapp-cta', content: { text: '¡Reservá tu viaje ahora!', phone: '5491112345678' } },
      ]),
      makeTpl('taxi-moderna', 'Moderna', 'Hero grande + lista compacta', 'prev-dark', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 8, type: 'banner',       content: { title: 'Viajá con Estilo', subtitle: 'Tu chofer de confianza en la ciudad', gradient: 'dark' } },
        { i: 't2', x: 0, y: 8,  w: 3,  h: 8, type: 'avatar',       content: { name: 'Carlos García', subtitle: 'Taxista premium', rating: 5 } },
        { i: 't3', x: 3, y: 8,  w: 9,  h: 8, type: 'price-list',   content: { title: 'Servicios', items: [{ label: 'Transfer aeropuerto', price: '$3.000' }, { label: 'Viaje local', price: '$600' }] } },
        { i: 't4', x: 0, y: 16, w: 12, h: 4, type: 'whatsapp-cta', content: { text: 'Escribime por WhatsApp', phone: '5491112345678' } },
      ]),
      makeTpl('taxi-compacta', 'Compacta', 'Solo lo esencial', 'prev-orange', [
        { i: 't1', x: 0, y: 0, w: 8,  h: 5, type: 'banner',       content: { title: 'Tu Taxista', subtitle: 'Disponible 24/7', gradient: 'orange' } },
        { i: 't2', x: 8, y: 0, w: 4,  h: 5, type: 'avatar',       content: { name: 'Tu Nombre', subtitle: 'Conductor', rating: 4.5 } },
        { i: 't3', x: 0, y: 5, w: 12, h: 5, type: 'whatsapp-cta', content: { text: 'Contactame ahora', phone: '5491112345678' } },
      ]),
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery / Comidas',
    emoji: '🛵',
    description: 'Mostrá tu menú, precios y tomá pedidos al instante',
    availableBlocks: ['header-minimal', 'banner', 'avatar', 'product-grid', 'price-list', 'pricing-table', 'whatsapp-cta', 'video-embed'],
    templates: [
      makeTpl('del-menu', 'Menú Completo', 'Fotos + precios + contacto', 'prev-orange', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 5,  type: 'banner',       content: { title: '🍕 La Mejor Pizza', subtitle: 'Delivery en 30 min · Todos los días', gradient: 'orange' } },
        { i: 't2', x: 0, y: 5,  w: 12, h: 8,  type: 'product-grid', content: { title: 'Nuestro menú', columns: 3 } },
        { i: 't3', x: 0, y: 13, w: 12, h: 6,  type: 'price-list',   content: { title: 'Precios', items: [{ label: 'Pizza Mozzarella', price: '$1.200' }, { label: 'Pizza Especial', price: '$1.800' }, { label: 'Empanadas (12u)', price: '$900' }] } },
        { i: 't4', x: 0, y: 19, w: 12, h: 4,  type: 'whatsapp-cta', content: { text: '¡Pedí ahora por WhatsApp!', phone: '5491112345678' } },
      ]),
      makeTpl('del-simple', 'Simple', 'Banner + precios + pedido', 'prev-red', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 6, type: 'banner',       content: { title: 'Delivery Express', subtitle: 'Pedí y recibí en minutos', gradient: 'red' } },
        { i: 't2', x: 0, y: 6,  w: 12, h: 8, type: 'price-list',   content: { title: 'Menú del día', items: [{ label: 'Plato del día', price: '$1.500' }, { label: 'Combo familiar', price: '$3.200' }] } },
        { i: 't3', x: 0, y: 14, w: 12, h: 4, type: 'whatsapp-cta', content: { text: 'Pedí ya', phone: '5491112345678' } },
      ]),
      makeTpl('del-premium', 'Premium', 'Galería + perfil + contacto', 'prev-purple', [
        { i: 't1', x: 0, y: 0,  w: 8,  h: 6, type: 'banner',       content: { title: 'Sabores que llegan a vos', subtitle: 'Cocina casera con amor', gradient: 'purple' } },
        { i: 't2', x: 8, y: 0,  w: 4,  h: 6, type: 'avatar',       content: { name: 'Casa Martínez', subtitle: 'Cocina casera', rating: 4.9 } },
        { i: 't3', x: 0, y: 6,  w: 12, h: 8, type: 'product-grid', content: { title: 'Nuestros platos', columns: 4 } },
        { i: 't4', x: 0, y: 14, w: 12, h: 4, type: 'whatsapp-cta', content: { text: 'Hacé tu pedido', phone: '5491112345678' } },
      ]),
    ],
  },
  {
    id: 'productos',
    label: 'Venta de Productos',
    emoji: '🛍️',
    description: 'Catálogo visual, precios y métodos de pago',
    availableBlocks: ['header-minimal', 'banner', 'hero-split', 'avatar', 'product-grid', 'price-list', 'pricing-table', 'gallery', 'benefit-list', 'whatsapp-cta', 'video-embed'],
    templates: [
      makeTpl('prod-catalogo', 'Catálogo', 'Grilla amplia de productos', 'prev-blue', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 5,  type: 'banner',       content: { title: 'Tu Tienda Online', subtitle: 'Los mejores productos, los mejores precios', gradient: 'blue' } },
        { i: 't2', x: 0, y: 5,  w: 12, h: 10, type: 'product-grid', content: { title: 'Productos destacados', columns: 4 } },
        { i: 't3', x: 0, y: 15, w: 12, h: 4,  type: 'whatsapp-cta', content: { text: 'Consultá disponibilidad', phone: '5491112345678' } },
      ]),
      makeTpl('prod-tienda', 'Tienda', 'Con perfil y galería', 'prev-teal', [
        { i: 't1', x: 0, y: 0,  w: 9,  h: 5,  type: 'banner',       content: { title: 'Tienda Oficial', subtitle: 'Envíos a todo el país', gradient: 'teal' } },
        { i: 't2', x: 9, y: 0,  w: 3,  h: 5,  type: 'avatar',       content: { name: 'La Tienda', subtitle: 'Vendedor oficial', rating: 4.7 } },
        { i: 't3', x: 0, y: 5,  w: 12, h: 10, type: 'product-grid', content: { title: 'Catálogo', columns: 3 } },
        { i: 't4', x: 0, y: 15, w: 12, h: 5,  type: 'price-list',   content: { title: 'Ofertas del día', items: [{ label: 'Producto A', price: '$2.500' }, { label: 'Producto B', price: '$4.800' }] } },
        { i: 't5', x: 0, y: 20, w: 12, h: 4,  type: 'whatsapp-cta', content: { text: 'Comprá por WhatsApp', phone: '5491112345678' } },
      ]),
      makeTpl('prod-minimal', 'Minimalista', 'Limpia y directa', 'prev-dark', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 6,  type: 'banner',       content: { title: 'Menos es más', subtitle: 'Productos de calidad', gradient: 'dark' } },
        { i: 't2', x: 0, y: 6,  w: 12, h: 10, type: 'gallery',      content: { title: 'Galería', columns: 4 } },
        { i: 't3', x: 0, y: 16, w: 12, h: 4,  type: 'whatsapp-cta', content: { text: 'Contactar vendedor', phone: '5491112345678' } },
      ]),
    ],
  },
  {
    id: 'servicios',
    label: 'Servicios / Profesional',
    emoji: '🔧',
    description: 'Presentá tus servicios, portfolio y tarifas',
    availableBlocks: ['header-minimal', 'banner', 'hero-split', 'avatar', 'price-list', 'pricing-table', 'icon-grid', 'benefit-list', 'gallery', 'bio', 'whatsapp-cta', 'video-embed'],
    templates: [
      makeTpl('serv-prof', 'Profesional', 'Perfil + servicios + contacto', 'prev-indigo', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 5, type: 'banner',       content: { title: 'Servicios Profesionales', subtitle: 'Calidad garantizada', gradient: 'indigo' } },
        { i: 't2', x: 0, y: 5,  w: 4,  h: 8, type: 'avatar',       content: { name: 'Profesional', subtitle: 'Especialista', rating: 5 } },
        { i: 't3', x: 4, y: 5,  w: 8,  h: 8, type: 'price-list',   content: { title: 'Servicios', items: [{ label: 'Servicio básico', price: '$3.000' }, { label: 'Servicio completo', price: '$6.500' }, { label: 'Urgencias', price: '$8.000' }] } },
        { i: 't4', x: 0, y: 13, w: 12, h: 4, type: 'whatsapp-cta', content: { text: 'Pedí un presupuesto', phone: '5491112345678' } },
      ]),
      makeTpl('serv-galeria', 'Con Galería', 'Trabajos realizados + contacto', 'prev-purple', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 5, type: 'banner',       content: { title: 'Nuestros Trabajos', subtitle: 'Resultados que hablan por sí solos', gradient: 'purple' } },
        { i: 't2', x: 0, y: 5,  w: 12, h: 8, type: 'gallery',      content: { title: 'Portfolio', columns: 3 } },
        { i: 't3', x: 0, y: 13, w: 12, h: 6, type: 'price-list',   content: { title: 'Presupuestos', items: [{ label: 'Pequeño', price: '$2.000' }, { label: 'Mediano', price: '$4.500' }] } },
        { i: 't4', x: 0, y: 19, w: 12, h: 4, type: 'whatsapp-cta', content: { text: 'Solicitá tu presupuesto', phone: '5491112345678' } },
      ]),
      makeTpl('serv-bio', 'Tarjeta Personal', 'Carta de presentación', 'prev-slate', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 5,  type: 'banner',       content: { title: 'Tu Nombre', subtitle: 'Tu especialidad', gradient: 'dark' } },
        { i: 't2', x: 0, y: 5,  w: 4,  h: 10, type: 'avatar',       content: { name: 'Tu Nombre', subtitle: 'Profesión', rating: 5 } },
        { i: 't3', x: 4, y: 5,  w: 8,  h: 10, type: 'bio',          content: { title: 'Sobre mí', text: 'Contá quién sos, tu experiencia y por qué elegirte.' } },
        { i: 't4', x: 0, y: 15, w: 12, h: 4,  type: 'whatsapp-cta', content: { text: 'Contactarme', phone: '5491112345678' } },
      ]),
    ],
  },
  {
    id: 'arte',
    label: 'Arte / Diseño',
    emoji: '🎨',
    description: 'Mostrá tu portfolio, obra y vendé tus creaciones',
    availableBlocks: ['header-glass', 'banner', 'avatar', 'gallery', 'bio', 'product-grid', 'social-links', 'whatsapp-cta', 'video-embed'],
    templates: [
      makeTpl('arte-portfolio', 'Portfolio', 'Galería masonry + bio', 'prev-pink', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 6,  type: 'banner',       content: { title: 'Mi Portfolio', subtitle: 'Arte, diseño y creatividad', gradient: 'pink' } },
        { i: 't2', x: 0, y: 6,  w: 12, h: 10, type: 'gallery',      content: { title: 'Obras', columns: 4 } },
        { i: 't3', x: 0, y: 16, w: 5,  h: 6,  type: 'avatar',       content: { name: 'Artista', subtitle: 'Creativo/a', rating: 5 } },
        { i: 't4', x: 5, y: 16, w: 7,  h: 6,  type: 'bio',          content: { title: 'Sobre mí', text: 'Mi historia como artista...' } },
      ]),
      makeTpl('arte-tienda', 'Tienda de Arte', 'Venta de obras', 'prev-red', [
        { i: 't1', x: 0, y: 0,  w: 12, h: 5,  type: 'banner',       content: { title: 'Tienda de Arte', subtitle: 'Piezas únicas y originales', gradient: 'pink' } },
        { i: 't2', x: 0, y: 5,  w: 12, h: 10, type: 'product-grid', content: { title: 'Obras disponibles', columns: 3 } },
        { i: 't3', x: 0, y: 15, w: 12, h: 4,  type: 'whatsapp-cta', content: { text: 'Consultá disponibilidad', phone: '5491112345678' } },
      ]),
      makeTpl('arte-personal', 'Marca Personal', 'Bio amplia + redes + galería', 'prev-yellow', [
        { i: 't1', x: 0, y: 0,  w: 8,  h: 6,  type: 'banner',       content: { title: 'Tu Arte, Tu Marca', subtitle: 'Creando desde hace años', gradient: 'gold' } },
        { i: 't2', x: 8, y: 0,  w: 4,  h: 6,  type: 'avatar',       content: { name: 'Tu Nombre', subtitle: 'Artista', rating: 4.8 } },
        { i: 't3', x: 0, y: 6,  w: 12, h: 5,  type: 'bio',          content: { title: 'Mi historia', text: 'Contá tu historia creativa aquí...' } },
        { i: 't4', x: 0, y: 11, w: 12, h: 8,  type: 'gallery',      content: { title: 'Galería', columns: 4 } },
        { i: 't5', x: 0, y: 19, w: 12, h: 3,  type: 'social-links', content: { links: [{ platform: 'Instagram', url: '#' }, { platform: 'Facebook', url: '#' }] } },
      ]),
    ],
  },
];
