import { create } from "zustand";
import { BLOCK_DEFINITIONS } from "../data/rubrosConfig";

const STORAGE_KEY = "waup_builder_state";

// Carga estado inicial desde localStorage
function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        rubro: parsed.rubro || null,
        templateId: parsed.templateId || null,
        layout: parsed.layout || [],
        pageConfig: parsed.pageConfig || defaultPageConfig(),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function defaultPageConfig() {
  return {
    name: "Mi Página",
    primaryColor: "#3b82f6",
    bgColor: "#ffffff",
    accentColor: "#f59e0b",
  };
}

const saved = loadInitialState();

export const useBuilderStore = create((set, get) => ({
  // Flujo de onboarding
  rubro: saved?.rubro || null,
  templateId: saved?.templateId || null,

  // Editor
  layout: saved?.layout || [],
  selectedItemId: null,
  isPreviewMode: false,
  viewMode: "desktop", // 'desktop' | 'mobile'
  draggingType: null,   // tipo de bloque que se está arrastrando desde la sidebar

  // Historial undo/redo
  past: [],
  future: [],

  // Configuración global de la página
  pageConfig: saved?.pageConfig || defaultPageConfig(),

  // ── Helpers internos ──────────────────────────────────────────────────────
  _saveToStorage: () => {
    const { rubro, templateId, layout, pageConfig } = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ rubro, templateId, layout, pageConfig }));
    } catch { /* ignore */ }
  },

  _pushHistory: () => {
    const { layout, past } = get();
    set({ past: [...past.slice(-30), [...layout]], future: [] });
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  setRubroAndTemplate: (rubro, templateId, preloadedLayout) => {
    const layout = preloadedLayout.map((item, idx) => ({
      ...item,
      i: `item-${idx}-${Date.now()}`,
    }));
    set({ rubro, templateId, layout, selectedItemId: null, past: [], future: [] });
    get()._saveToStorage();
  },

  startBlank: (rubro) => {
    set({ rubro, templateId: null, layout: [], selectedItemId: null, past: [], future: [] });
    get()._saveToStorage();
  },

  resetBuilder: () => {
    set({ rubro: null, templateId: null, layout: [], selectedItemId: null, past: [], future: [] });
    localStorage.removeItem(STORAGE_KEY);
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  addElement: (type, position = null) => {
    const def = BLOCK_DEFINITIONS[type];
    if (!def) return;
    get()._pushHistory();
    const id = `item-${type}-${Date.now()}`;
    const defaults = getDefaultContent(type);
    // Calcular y: agregar siempre al final del layout
    const maxY = get().layout.reduce((acc, it) => Math.max(acc, it.y + it.h), 0);
    const newItem = {
      i: id,
      x: position?.x ?? 0,
      y: position?.y ?? maxY,
      w: def.defaultW,
      h: def.defaultH,
      type,
      content: defaults,
    };
    set((state) => ({
      layout: [...state.layout, newItem],
      selectedItemId: id,
    }));
    get()._saveToStorage();
  },

  updateLayout: (newLayout) => {
    set((state) => ({
      layout: state.layout.map((item) => {
        const match = newLayout.find((l) => l.i === item.i);
        return match
          ? { ...item, x: match.x, y: match.y, w: match.w, h: match.h }
          : item;
      }),
    }));
    get()._saveToStorage();
  },

  removeItem: (id) => {
    get()._pushHistory();
    set((state) => ({
      layout: state.layout.filter((item) => item.i !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
    get()._saveToStorage();
  },

  duplicateItem: (id) => {
    const { layout } = get();
    const item = layout.find((i) => i.i === id);
    if (!item) return;
    get()._pushHistory();
    const newId = `item-${item.type}-${Date.now()}`;
    const duplicate = {
      ...item,
      i: newId,
      y: item.y + item.h,
      content: { ...item.content },
    };
    set((state) => ({
      layout: [...state.layout, duplicate],
      selectedItemId: newId,
    }));
    get()._saveToStorage();
  },

  selectItem: (id) => set({ selectedItemId: id }),

  updateItemContent: (id, newContent) => {
    set((state) => ({
      layout: state.layout.map((item) =>
        item.i === id
          ? { ...item, content: { ...item.content, ...newContent } }
          : item,
      ),
    }));
    get()._saveToStorage();
  },

  // ── Drag desde sidebar ────────────────────────────────────────────────────
  setDraggingType: (type) => set({ draggingType: type }),

  // ── Undo / Redo ───────────────────────────────────────────────────────────
  undo: () => {
    const { past, layout, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      layout: previous,
      future: [[...layout], ...future.slice(0, 30)],
      selectedItemId: null,
    });
    get()._saveToStorage();
  },

  redo: () => {
    const { past, layout, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      past: [...past.slice(-30), [...layout]],
      layout: next,
      future: future.slice(1),
      selectedItemId: null,
    });
    get()._saveToStorage();
  },

  // ── Config global ─────────────────────────────────────────────────────────
  updatePageConfig: (partial) => {
    set((state) => ({ pageConfig: { ...state.pageConfig, ...partial } }));
    get()._saveToStorage();
  },

  togglePreviewMode: () =>
    set((state) => ({
      isPreviewMode: !state.isPreviewMode,
      selectedItemId: null,
    })),

  setViewMode: (mode) => set({ viewMode: mode }),
}));

// ── Contenido por defecto según tipo de bloque ────────────────────────────────
function getDefaultContent(type) {
  const defaults = {
    'header-minimal': { brand: 'Tu Marca', links: ['Inicio', 'Servicios', 'Contacto'] },
    'header-centered': { brand: 'Tu Marca', tagline: 'Tu eslogan aquí', links: ['Inicio', 'Servicios', 'Contacto'] },
    'header-glass': { brand: 'Tu Marca', links: ['Inicio', 'Portfolio', 'Contacto'] },
    banner: { title: 'Tu Título Aquí', subtitle: 'Escribí un eslogan o descripción', gradient: 'blue' },
    'hero-split': {
      title: 'Tu Propuesta de Valor', subtitle: 'Describí tu servicio principal en pocas palabras.',
      badge: '✨ Nuevo', cta: 'Contactar ahora', gradient: 'blue',
    },
    'stats-row': {
      items: [
        { value: '+200', label: 'Clientes felices' },
        { value: '5★', label: 'Puntuación promedio' },
        { value: '+5', label: 'Años de experiencia' },
        { value: '24/7', label: 'Disponibilidad' },
      ],
    },
    avatar: { name: 'Tu Nombre', subtitle: 'Tu cargo o especialidad', rating: 5 },
    'price-list': { title: 'Precios / Servicios', items: [{ label: 'Servicio 1', price: '$0' }, { label: 'Servicio 2', price: '$0' }] },
    'pricing-table': {
      title: 'Nuestros Planes',
      plans: [
        { name: 'Básico', price: '$500', features: ['Servicio 1', 'Soporte por email'], cta: 'Elegir', highlighted: false },
        { name: 'Pro',    price: '$1.500', features: ['Todo el básico', 'Prioridad', 'Soporte 24/7'], cta: 'Elegir', highlighted: true },
        { name: 'Full',   price: '$3.000', features: ['Todo el Pro', 'Consultoría', 'Sin límites'], cta: 'Elegir', highlighted: false },
      ],
    },
    'icon-grid': {
      title: '¿Por qué elegirnos?',
      items: [
        { icon: '⚡', label: 'Rápido', desc: 'Resultados en tiempo récord' },
        { icon: '🎯', label: 'Preciso', desc: 'Trabajo enfocado en tus objetivos' },
        { icon: '💎', label: 'Premium', desc: 'Calidad garantizada' },
        { icon: '🤝', label: 'Confiable', desc: 'Más de 200 clientes satisfechos' },
        { icon: '🔒', label: 'Seguro', desc: 'Tu información está protegida' },
        { icon: '📱', label: 'Digital', desc: 'Siempre disponible online' },
      ],
    },
    'benefit-list': {
      title: 'Beneficios',
      items: [
        { text: 'Atención personalizada' },
        { text: 'Presupuesto sin cargo' },
        { text: 'Garantía de satisfacción' },
        { text: 'Envío gratis en compras +$5000' },
      ],
    },
    'whatsapp-cta': { text: '¡Contactame por WhatsApp!', phone: '5491100000000' },
    'product-grid': { title: 'Mis Productos', columns: 3 },
    gallery: { title: 'Galería de Fotos', columns: 3 },
    bio: { title: 'Sobre mí', text: 'Contá quién sos y qué ofrecés...' },
    'social-links': { links: [{ platform: 'Instagram', url: '#' }, { platform: 'Facebook', url: '#' }] },
    'coverage-text': { title: 'Zona de Cobertura', zones: ['Centro', 'Norte', 'Sur'] },
    'video-embed': { title: '', embedUrl: '', videoUrl: null },
  };
  return defaults[type] || {};
}
