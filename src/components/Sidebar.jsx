import { useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { RUBROS, BLOCK_DEFINITIONS, BLOCK_CATEGORIES } from '../data/rubrosConfig';
import MediaUploader from './MediaUploader';

// ─── Tab: Añadir bloques ───────────────────────────────────────────────────────
function TabAdd({ rubro }) {
  const { addElement, setDraggingType } = useBuilderStore();
  const [activeCategory, setActiveCategory] = useState('info');

  const rubroObj = RUBROS.find(r => r.id === rubro);
  const availableKeys = rubroObj?.availableBlocks || Object.keys(BLOCK_DEFINITIONS);

  const filtered = availableKeys.filter(key => {
    const def = BLOCK_DEFINITIONS[key];
    return def && def.category === activeCategory;
  });

  const availableCategories = BLOCK_CATEGORIES.filter(cat =>
    availableKeys.some(k => BLOCK_DEFINITIONS[k]?.category === cat.id)
  );

  function handleDragStart(e, key) {
    e.dataTransfer.setData('blockType', key);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingType(key);
  }

  function handleDragEnd() {
    setDraggingType(null);
  }

  return (
    <div>
      <div className="cat-tabs">
        {availableCategories.map(cat => (
          <button
            key={cat.id}
            className={`cat-tab${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <p className="sidebar-section-title">Bloques — arrastrá o hacé clic</p>
      {filtered.length === 0 && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '12px 0' }}>
          No hay bloques en esta categoría para tu rubro.
        </p>
      )}
      {filtered.map(key => {
        const def = BLOCK_DEFINITIONS[key];
        if (!def) return null;
        return (
          <button
            key={key}
            className="block-btn"
            draggable
            onDragStart={(e) => handleDragStart(e, key)}
            onDragEnd={handleDragEnd}
            onClick={() => addElement(key)}
          >
            <span className="block-btn-drag-hint">⠿</span>
            <span className="block-btn-icon">{def.emoji}</span>
            <div>
              <div className="block-btn-label">{def.label}</div>
              <div className="block-btn-sub">Arrastrar o clic</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Tab: Diseño / Editar bloque seleccionado ─────────────────────────────────
const GRADIENTS_LIST = ['blue','gold','orange','red','purple','pink','teal','indigo','dark','green'];
const gradMap = {
  blue:['#3b82f6','#6366f1'], gold:['#f59e0b','#ef4444'], orange:['#f97316','#ef4444'],
  red:['#ef4444','#dc2626'], purple:['#8b5cf6','#ec4899'], pink:['#ec4899','#f43f5e'],
  teal:['#14b8a6','#3b82f6'], indigo:['#6366f1','#8b5cf6'], dark:['#1e293b','#0f172a'],
  green:['#22c55e','#14b8a6'],
};

const SOCIAL_PLATFORMS = ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube', 'LinkedIn', 'Pinterest'];

function TabDesign() {
  // ✅ FIX: Leer directamente del store para que los cambios sean reactivos
  const { layout, selectedItemId, updateItemContent } = useBuilderStore();
  const selectedItem = layout.find(i => i.i === selectedItemId) || null;

  if (!selectedItem) {
    return (
      <div className="no-selection">
        <span>👆</span>
        <p>Hacé clic en un bloque del canvas para editarlo aquí.</p>
      </div>
    );
  }

  const c = selectedItem.content || {};
  const id = selectedItem.i;

  function update(partial) { updateItemContent(id, partial); }

  function updatePriceItem(idx, field, value) {
    const items = [...(c.items || [])];
    items[idx] = { ...items[idx], [field]: value };
    update({ items });
  }

  function addPriceItem() {
    update({ items: [...(c.items || []), { label: 'Nuevo servicio', price: '$0' }] });
  }

  function removePriceItem(idx) {
    update({ items: (c.items || []).filter((_, i) => i !== idx) });
  }

  function updatePlan(idx, field, value) {
    const plans = [...(c.plans || [])];
    plans[idx] = { ...plans[idx], [field]: value };
    update({ plans });
  }

  function addPlan() {
    update({ plans: [...(c.plans || []), { name: 'Nuevo plan', price: '$0', features: [], cta: 'Elegir', highlighted: false }] });
  }

  function removePlan(idx) {
    update({ plans: (c.plans || []).filter((_, i) => i !== idx) });
  }

  function updateIconItem(idx, field, value) {
    const items = [...(c.items || [])];
    items[idx] = { ...items[idx], [field]: value };
    update({ items });
  }

  function updateSocialLink(idx, field, value) {
    const links = [...(c.links || [])];
    links[idx] = { ...links[idx], [field]: value };
    update({ links });
  }

  function addSocialLink() {
    update({ links: [...(c.links || []), { platform: 'Instagram', url: '#' }] });
  }

  function removeSocialLink(idx) {
    update({ links: (c.links || []).filter((_, i) => i !== idx) });
  }

  function updateStat(idx, field, value) {
    const items = [...(c.items || [])];
    items[idx] = { ...items[idx], [field]: value };
    update({ items });
  }

  function updateBenefit(idx, value) {
    const items = [...(c.items || [])];
    items[idx] = { ...items[idx], text: value };
    update({ items });
  }

  function GradPicker() {
    return (
      <div className="design-field">
        <label className="design-label">Color de fondo</label>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {GRADIENTS_LIST.map(g=>(
            <button key={g} onClick={()=>update({gradient:g})}
              style={{width:28,height:28,borderRadius:6,border: c.gradient===g ? '2px solid #818cf8':'2px solid transparent',
                background:`linear-gradient(135deg,${gradMap[g][0]},${gradMap[g][1]})`,cursor:'pointer'}}
              title={g}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="sidebar-section-title">Editando: {BLOCK_DEFINITIONS[selectedItem.type]?.label}</p>

      {/* Headers */}
      {(selectedItem.type === 'header-minimal' || selectedItem.type === 'header-centered' || selectedItem.type === 'header-glass') && (
        <>
          <div className="design-field"><label className="design-label">Logo / Imagen de marca</label>
            <MediaUploader
              value={c.logoUrl || null}
              onChange={url => update({ logoUrl: url })}
              accept="image"
              label=""
            />
          </div>
          <div className="design-field"><label className="design-label">Marca / Nombre</label>
            <input className="design-input" value={c.brand||''} onChange={e=>update({brand:e.target.value})} /></div>
          {selectedItem.type === 'header-centered' && (
            <div className="design-field"><label className="design-label">Eslogan</label>
              <input className="design-input" value={c.tagline||''} onChange={e=>update({tagline:e.target.value})} /></div>
          )}
          <div className="design-field"><label className="design-label">Links del menú (separados por coma)</label>
            <input className="design-input" value={(c.links||[]).join(', ')} onChange={e=>update({links:e.target.value.split(',').map(l=>l.trim())})} /></div>
        </>
      )}

      {/* Banner */}
      {selectedItem.type === 'banner' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Subtítulo</label>
            <input className="design-input" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} /></div>
          <GradPicker />
        </>
      )}

      {/* Hero Split */}
      {selectedItem.type === 'hero-split' && (
        <>
          <div className="design-field"><label className="design-label">Badge</label>
            <input className="design-input" value={c.badge||''} onChange={e=>update({badge:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Título principal</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Subtítulo</label>
            <textarea className="design-input" rows="3" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Texto del botón CTA</label>
            <input className="design-input" value={c.cta||''} onChange={e=>update({cta:e.target.value})} /></div>
          <MediaUploader
            value={c.imageUrl || null}
            onChange={url => update({ imageUrl: url })}
            accept="image"
            label="Imagen del hero (opcional)"
          />
          <GradPicker />
        </>
      )}

      {/* Stats Row */}
      {selectedItem.type === 'stats-row' && (
        <>
          <p className="sidebar-section-title">Estadísticas</p>
          {(c.items||[]).map((item,i)=>(
            <div key={i} style={{marginBottom:10,background:'var(--surface)',borderRadius:8,padding:10}}>
              <input className="design-input" value={item.value} onChange={e=>updateStat(i,'value',e.target.value)} placeholder="Ej: +200" style={{marginBottom:6}} />
              <input className="design-input" value={item.label} onChange={e=>updateStat(i,'label',e.target.value)} placeholder="Descripción" />
            </div>
          ))}
        </>
      )}

      {/* Avatar */}
      {selectedItem.type === 'avatar' && (
        <>
          <MediaUploader
            value={c.imageUrl || null}
            onChange={url => update({ imageUrl: url })}
            accept="image"
            label="Foto de perfil"
          />
          <div className="design-field"><label className="design-label">Nombre</label>
            <input className="design-input" value={c.name||''} onChange={e=>update({name:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Cargo / Descripción</label>
            <input className="design-input" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Puntuación (1-5)</label>
            <input className="design-input" type="number" min="1" max="5" step="0.1" value={c.rating||5} onChange={e=>update({rating:parseFloat(e.target.value)})} /></div>
        </>
      )}

      {/* Price List */}
      {selectedItem.type === 'price-list' && (
        <>
          <div className="design-field"><label className="design-label">Título de la lista</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <p className="sidebar-section-title">Ítems</p>
          {(c.items||[]).map((item,i)=>(
            <div key={i} style={{marginBottom:10,background:'var(--surface)',borderRadius:8,padding:10}}>
              <input className="design-input" value={item.label} onChange={e=>updatePriceItem(i,'label',e.target.value)} placeholder="Servicio" style={{marginBottom:6}} />
              <div style={{display:'flex',gap:6}}>
                <input className="design-input" value={item.price} onChange={e=>updatePriceItem(i,'price',e.target.value)} placeholder="$0" style={{flex:1}} />
                <button onClick={()=>removePriceItem(i)} className="btn-del">×</button>
              </div>
            </div>
          ))}
          <button onClick={addPriceItem} className="block-btn" style={{justifyContent:'center',color:'var(--accent-2)'}}>+ Agregar ítem</button>
        </>
      )}

      {/* Pricing Table */}
      {selectedItem.type === 'pricing-table' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          {(c.plans||[]).map((plan,i)=>(
            <div key={i} style={{marginBottom:12,background:'var(--surface)',borderRadius:8,padding:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <p className="sidebar-section-title" style={{margin:0}}>Plan {i+1}</p>
                <button onClick={()=>removePlan(i)} className="btn-del">×</button>
              </div>
              <input className="design-input" value={plan.name} onChange={e=>updatePlan(i,'name',e.target.value)} placeholder="Nombre del plan" style={{marginBottom:6}} />
              <input className="design-input" value={plan.price} onChange={e=>updatePlan(i,'price',e.target.value)} placeholder="$0" style={{marginBottom:6}} />
              <input className="design-input" value={plan.cta} onChange={e=>updatePlan(i,'cta',e.target.value)} placeholder="Texto del botón" style={{marginBottom:6}} />
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-secondary)',cursor:'pointer'}}>
                <input type="checkbox" checked={!!plan.highlighted} onChange={e=>updatePlan(i,'highlighted',e.target.checked)} />
                Destacar este plan
              </label>
            </div>
          ))}
          <button onClick={addPlan} className="block-btn" style={{justifyContent:'center',color:'var(--accent-2)'}}>+ Agregar plan</button>
        </>
      )}

      {/* Icon Grid */}
      {selectedItem.type === 'icon-grid' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          {(c.items||[]).map((item,i)=>(
            <div key={i} style={{marginBottom:8,background:'var(--surface)',borderRadius:8,padding:8}}>
              <div style={{display:'flex',gap:6,marginBottom:6}}>
                <input className="design-input" value={item.icon} onChange={e=>updateIconItem(i,'icon',e.target.value)} placeholder="🔷" style={{width:48,textAlign:'center'}} />
                <input className="design-input" value={item.label} onChange={e=>updateIconItem(i,'label',e.target.value)} placeholder="Título" style={{flex:1}} />
              </div>
              <input className="design-input" value={item.desc} onChange={e=>updateIconItem(i,'desc',e.target.value)} placeholder="Descripción corta" />
            </div>
          ))}
        </>
      )}

      {/* Benefit List */}
      {selectedItem.type === 'benefit-list' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          {(c.items||[]).map((item,i)=>(
            <div key={i} style={{display:'flex',gap:6,marginBottom:6}}>
              <input className="design-input" value={item.text} onChange={e=>updateBenefit(i,e.target.value)} placeholder="Beneficio" style={{flex:1}} />
              <button onClick={()=>update({items:(c.items||[]).filter((_,j)=>j!==i)})} className="btn-del">×</button>
            </div>
          ))}
          <button onClick={()=>update({items:[...(c.items||[]),{text:'Nuevo beneficio'}]})} className="block-btn" style={{justifyContent:'center',color:'var(--accent-2)'}}>+ Agregar</button>
        </>
      )}

      {/* WhatsApp */}
      {selectedItem.type === 'whatsapp-cta' && (
        <>
          <div className="design-field"><label className="design-label">Texto del botón</label>
            <input className="design-input" value={c.text||''} onChange={e=>update({text:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Número (con código país)</label>
            <input className="design-input" value={c.phone||''} onChange={e=>update({phone:e.target.value})} placeholder="5491112345678" /></div>
        </>
      )}

      {/* Product grid */}
      {selectedItem.type === 'product-grid' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Columnas</label>
            <select className="design-input" value={c.columns||3} onChange={e=>update({columns:parseInt(e.target.value)})}>
              <option value="2">2 columnas</option>
              <option value="3">3 columnas</option>
              <option value="4">4 columnas</option>
            </select>
          </div>
          <MediaUploader
            multiple
            values={c.images || []}
            onChangeMultiple={urls => update({ images: urls })}
            accept="image"
            label="Imágenes de productos"
          />
        </>
      )}

      {/* Gallery */}
      {selectedItem.type === 'gallery' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Columnas</label>
            <select className="design-input" value={c.columns||3} onChange={e=>update({columns:parseInt(e.target.value)})}>
              <option value="2">2 columnas</option>
              <option value="3">3 columnas</option>
              <option value="4">4 columnas</option>
            </select>
          </div>
          <MediaUploader
            multiple
            values={c.images || []}
            onChangeMultiple={urls => update({ images: urls })}
            accept="both"
            label="Fotos y videos de la galería"
          />
        </>
      )}

      {/* Bio */}
      {selectedItem.type === 'bio' && (
        <>
          <MediaUploader
            value={c.imageUrl || null}
            onChange={url => update({ imageUrl: url })}
            accept="image"
            label="Foto (opcional)"
          />
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Texto</label>
            <textarea className="design-input" rows="5" value={c.text||''} onChange={e=>update({text:e.target.value})} /></div>
        </>
      )}

      {/* Social Links */}
      {selectedItem.type === 'social-links' && (
        <>
          <p className="sidebar-section-title">Redes Sociales</p>
          {(c.links||[]).map((link,i)=>(
            <div key={i} style={{marginBottom:8,background:'var(--surface)',borderRadius:8,padding:8}}>
              <select className="design-input" value={link.platform} onChange={e=>updateSocialLink(i,'platform',e.target.value)} style={{marginBottom:6}}>
                {SOCIAL_PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
              <div style={{display:'flex',gap:6}}>
                <input className="design-input" value={link.url} onChange={e=>updateSocialLink(i,'url',e.target.value)} placeholder="https://..." style={{flex:1}} />
                <button onClick={()=>removeSocialLink(i)} className="btn-del">×</button>
              </div>
            </div>
          ))}
          <button onClick={addSocialLink} className="block-btn" style={{justifyContent:'center',color:'var(--accent-2)'}}>+ Agregar red</button>
        </>
      )}

      {/* Coverage */}
      {selectedItem.type === 'coverage-text' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Zonas (separadas por coma)</label>
            <input className="design-input" value={(c.zones||[]).join(', ')} onChange={e=>update({zones:e.target.value.split(',').map(z=>z.trim())})} /></div>
        </>
      )}

      {/* Video Embed */}
      {selectedItem.type === 'video-embed' && (
        <>
          <MediaUploader
            value={c.videoUrl || null}
            onChange={url => update({ videoUrl: url })}
            accept="video"
            label="Video (MP4, WEBM)"
          />
          <div className="design-field"><label className="design-label">— O URL de YouTube/Vimeo —</label>
            <input className="design-input" value={c.embedUrl||''} onChange={e=>update({embedUrl:e.target.value})} placeholder="https://youtube.com/watch?v=..." /></div>
          <div className="design-field"><label className="design-label">Título del video (opcional)</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
        </>
      )}
    </div>
  );
}

// ─── Tab: Config de Página ────────────────────────────────────────────────────
function TabPage() {
  const { pageConfig, updatePageConfig } = useBuilderStore();
  return (
    <div>
      <p className="sidebar-section-title">Nombre de la página</p>
      <div className="design-field">
        <input className="design-input" value={pageConfig.name} onChange={e=>updatePageConfig({name:e.target.value})} />
      </div>
      <p className="sidebar-section-title">Colores</p>
      <div>
        {[
          {key:'primaryColor',label:'Principal'},
          {key:'accentColor',label:'Acento'},
          {key:'bgColor',label:'Fondo'},
        ].map(({key,label})=>(
          <div key={key} className="design-field">
            <label className="design-label">{label}</label>
            <div className="design-color-row">
              <input type="color" className="design-color-swatch" value={pageConfig[key]} onChange={e=>updatePageConfig({[key]:e.target.value})} />
              <input className="design-input" value={pageConfig[key]} onChange={e=>updatePageConfig({[key]:e.target.value})} style={{flex:1}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar principal ────────────────────────────────────────────────────────
export default function Sidebar() {
  const [tab, setTab] = useState('add');
  // ✅ FIX: sólo necesitamos rubro y selectedItemId del store a nivel Sidebar
  const { rubro, selectedItemId } = useBuilderStore();

  // Auto-switch to Design tab when a block is selected
  const activeTab = selectedItemId && tab === 'add' ? 'design' : tab;

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        {[
          { id: 'add',    label: '＋', title: 'Añadir bloques' },
          { id: 'design', label: '✏️', title: 'Diseño' },
          { id: 'page',   label: '⚙️', title: 'Página' },
        ].map(t => (
          <button
            key={t.id}
            className={`sidebar-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
            title={t.title}
          >
            {t.label} <span className="sidebar-tab-label">{t.title}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {activeTab === 'add'    && <TabAdd rubro={rubro} />}
        {activeTab === 'design' && <TabDesign />}
        {activeTab === 'page'   && <TabPage />}
      </div>
    </div>
  );
}