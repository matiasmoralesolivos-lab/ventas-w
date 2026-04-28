import { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { RUBROS, BLOCK_DEFINITIONS, BLOCK_CATEGORIES } from '../data/rubrosConfig';
import MediaUploader from './MediaUploader';

// ─── Tab: Añadir bloques ───────────────────────────────────────────────────────
function TabAdd({ rubro, templateId }) {
  const { addElement, setDraggingType, draggingType } = useBuilderStore();
  const [activeCategory, setActiveCategory] = useState('info');

  const rubroObj = RUBROS.find(r => r.id === rubro);
  const tplObj = rubroObj?.templates?.find(t => t.id === templateId);
  const availableKeys = tplObj?.availableBlocks || Object.keys(BLOCK_DEFINITIONS);

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
            className={`block-btn droppableElement${draggingType === key ? ' is-dragging' : ''}`}
            draggable={true}
            unselectable="on"
            onDragStart={(e) => handleDragStart(e, key)}
            onDragEnd={handleDragEnd}
            onClick={() => addElement(key)}
          >
            <span className="block-btn-drag-hint">⠿</span>
            <span className="block-btn-icon">{def.emoji}</span>
            <div>
              <div className="block-btn-label">{def.label}</div>
              <div className="block-btn-sub">Arrastrá o clic para añadir</div>
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

const SOCIAL_PLATFORMS = ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube', 'LinkedIn', 'Pinterest', 'WhatsApp'];

const BADGE_ICONS = [
  '🚀','⭐','🔥','💡','✅','🏆','🎯','💎','⚡','🌟',
  '🎨','🔑','💪','🛡️','🌈','🎪','🏅','🎖️','💫','🌀',
  '✨','🎉','🎊','🎁','🎗️','🔔','📣','💬','📱','🖥️',
  '🛒','🤝','🌍','🌿','⚙️','🔧','📊','📈','📋','🗂️'
];

// ─── Reusable color pickers for bg + text ──────────────────────────────────────
function ColorPickers({ c, update }) {
  return (
    <>
      <div className="design-field">
        <label className="design-label">Color de fondo</label>
        <div className="design-color-row">
          <input type="color" className="design-color-swatch" value={c.bgColor || '#ffffff'} onChange={e => update({ bgColor: e.target.value })} />
          <input className="design-input" value={c.bgColor || ''} onChange={e => update({ bgColor: e.target.value })} placeholder="#ffffff" style={{ flex: 1 }} />
          {c.bgColor && <button onClick={() => update({ bgColor: '' })} className="btn-del" title="Resetear" style={{flexShrink:0}}>↺</button>}
        </div>
      </div>
      <div className="design-field">
        <label className="design-label">Color de texto</label>
        <div className="design-color-row">
          <input type="color" className="design-color-swatch" value={c.textColor || '#1e293b'} onChange={e => update({ textColor: e.target.value })} />
          <input className="design-input" value={c.textColor || ''} onChange={e => update({ textColor: e.target.value })} placeholder="#1e293b" style={{ flex: 1 }} />
          {c.textColor && <button onClick={() => update({ textColor: '' })} className="btn-del" title="Resetear" style={{flexShrink:0}}>↺</button>}
        </div>
      </div>
    </>
  );
}

function TabDesign() {
  // ✅ FIX: Leer directamente del store para que los cambios sean reactivos
  const { layout, selectedItemId, updateItemContent } = useBuilderStore();
  const selectedItem = layout.find(i => i.i === selectedItemId) || null;

  if (!selectedItem) {
    return (
      <div className="no-selection">
        <span>👆</span>
        <p>Hacé clic en un bloque del canvas para editarlo aquí.</p>
        <button
          className="block-btn"
          style={{ justifyContent: 'center', color: 'var(--accent-2)', marginTop: 12 }}
          onClick={() => useBuilderStore.getState().selectItem(null)}
        >
          ＋ Volver a Añadir bloques
        </button>
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
          <ColorPickers c={c} update={update} />
        </>
      )}

      {/* Banner */}
      {selectedItem.type === 'banner' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Subtítulo</label>
            <input className="design-input" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} /></div>
          <MediaUploader
            value={c.imageUrl || null}
            onChange={url => update({ imageUrl: url })}
            accept="image"
            label="Imagen de fondo (opcional)"
          />
          <GradPicker />
          <div className="design-field">
            <label className="design-label">Color de fondo sólido <small style={{color:'var(--text-muted)'}}>(reemplaza gradiente)</small></label>
            <div className="design-color-row">
              <input type="color" className="design-color-swatch" value={c.bgColor || '#3b82f6'} onChange={e => update({ bgColor: e.target.value })} />
              <input className="design-input" value={c.bgColor || ''} onChange={e => update({ bgColor: e.target.value })} placeholder="Dejar vacío para gradiente" style={{ flex: 1 }} />
              {c.bgColor && <button onClick={() => update({ bgColor: '' })} className="btn-del" title="Resetear" style={{flexShrink:0}}>↺</button>}
            </div>
          </div>
          <div className="design-field">
            <label className="design-label">Color de texto</label>
            <div className="design-color-row">
              <input type="color" className="design-color-swatch" value={c.textColor || '#ffffff'} onChange={e => update({ textColor: e.target.value })} />
              <input className="design-input" value={c.textColor || ''} onChange={e => update({ textColor: e.target.value })} placeholder="#ffffff" style={{ flex: 1 }} />
              {c.textColor && <button onClick={() => update({ textColor: '' })} className="btn-del" title="Resetear" style={{flexShrink:0}}>↺</button>}
            </div>
          </div>
        </>
      )}

      {/* Hero Split */}
      {selectedItem.type === 'hero-split' && (
        <>
          <div className="design-field">
            <label className="design-label">Texto del Badge</label>
            <input className="design-input" value={c.badge||''} onChange={e=>update({badge:e.target.value})} placeholder="Ej: Nuevo, Oferta..." />
          </div>
          <div className="design-field">
            <label className="design-label">Ícono del Badge</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 120, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 8 }}>
              {BADGE_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => update({ badgeIcon: icon })}
                  title={icon}
                  style={{
                    width: 34, height: 34, fontSize: 18, borderRadius: 6, cursor: 'pointer',
                    border: c.badgeIcon === icon ? '2px solid var(--accent)' : '2px solid transparent',
                    background: c.badgeIcon === icon ? 'rgba(230,0,126,0.2)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
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
          <ColorPickers c={c} update={update} />
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
          <ColorPickers c={c} update={update} />
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
          <MediaUploader
            value={c.bgImageUrl || null}
            onChange={url => update({ bgImageUrl: url })}
            accept="image"
            label="Imagen de fondo (opcional)"
          />
          <div className="design-field"><label className="design-label">Nombre</label>
            <input className="design-input" value={c.name||''} onChange={e=>update({name:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Cargo / Descripción</label>
            <input className="design-input" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Puntuación (1-5)</label>
            <input className="design-input" type="number" min="1" max="5" step="0.1" value={c.rating||5} onChange={e=>update({rating:parseFloat(e.target.value)})} /></div>
          <ColorPickers c={c} update={update} />
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
              <input className="design-input" value={item.label || item.name || ''} onChange={e=>updatePriceItem(i,'label',e.target.value)} placeholder="Servicio" style={{marginBottom:6}} />
              <div style={{display:'flex',gap:6}}>
                <input className="design-input" value={item.price || ''} onChange={e=>updatePriceItem(i,'price',e.target.value)} placeholder="$0" style={{flex:1}} />
                <button onClick={()=>removePriceItem(i)} className="btn-del">×</button>
              </div>
            </div>
          ))}
          <button onClick={addPriceItem} className="block-btn" style={{justifyContent:'center',color:'var(--accent-2)'}}>+ Agregar ítem</button>
          <ColorPickers c={c} update={update} />
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
          <ColorPickers c={c} update={update} />
        </>
      )}

      {/* Icon Grid */}
      {selectedItem.type === 'icon-grid' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          {(c.items||[]).map((item,i)=>(
            <div key={i} style={{marginBottom:8,background:'var(--surface)',borderRadius:8,padding:8}}>
              <div style={{display:'flex',gap:6,marginBottom:6,alignItems:'center'}}>
                {/* Emoji actual + input manual */}
                <span style={{fontSize:22,lineHeight:1,flexShrink:0}}>{item.icon || '🔷'}</span>
                <input
                  className="design-input"
                  value={item.icon}
                  onChange={e=>updateIconItem(i,'icon',e.target.value)}
                  placeholder="🔷"
                  style={{width:52,textAlign:'center',fontSize:18}}
                  title="Escribí o pegá cualquier emoji"
                />
                <input className="design-input" value={item.label} onChange={e=>updateIconItem(i,'label',e.target.value)} placeholder="Título" style={{flex:1}} />
              </div>
              {/* Picker rápido de iconos */}
              <div style={{display:'flex',flexWrap:'wrap',gap:4,maxHeight:96,overflowY:'auto',background:'rgba(0,0,0,0.2)',borderRadius:6,padding:6,marginBottom:6}}>
                {BADGE_ICONS.map(icon=>(
                  <button
                    key={icon}
                    onClick={()=>updateIconItem(i,'icon',icon)}
                    title={icon}
                    style={{
                      width:30,height:30,fontSize:16,borderRadius:5,cursor:'pointer',
                      border:item.icon===icon?'2px solid var(--accent)':'2px solid transparent',
                      background:item.icon===icon?'rgba(230,0,126,0.2)':'rgba(255,255,255,0.05)',
                      display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'
                    }}
                  >{icon}</button>
                ))}
              </div>
              <input className="design-input" value={item.desc} onChange={e=>updateIconItem(i,'desc',e.target.value)} placeholder="Descripción corta" />
            </div>
          ))}
          <ColorPickers c={c} update={update} />
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
          <ColorPickers c={c} update={update} />
        </>
      )}

      {/* WhatsApp */}
      {selectedItem.type === 'whatsapp-cta' && (
        <>
          <div className="design-field"><label className="design-label">Texto del botón</label>
            <input className="design-input" value={c.text||''} onChange={e=>update({text:e.target.value})} /></div>
          <div className="design-field">
            <label className="design-label">Número (con código país)</label>
            <input className="design-input" value={c.phone||''} onChange={e=>update({phone:e.target.value})} placeholder="5491112345678" />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>💡 Al hacer clic en el canvas o en la vista previa, abrirá WhatsApp con este número.</p>
          </div>
          <div className="design-field">
            <label className="design-label">Color de fondo <small style={{color:'var(--text-muted)'}}>(vacío = verde WhatsApp)</small></label>
            <div className="design-color-row">
              <input type="color" className="design-color-swatch" value={c.bgColor || '#25d366'} onChange={e => update({ bgColor: e.target.value })} />
              <input className="design-input" value={c.bgColor || ''} onChange={e => update({ bgColor: e.target.value })} placeholder="Dejar vacío = verde" style={{ flex: 1 }} />
              {c.bgColor && <button onClick={() => update({ bgColor: '' })} className="btn-del" title="Resetear" style={{flexShrink:0}}>↺</button>}
            </div>
          </div>
          <div className="design-field">
            <label className="design-label">Color de texto</label>
            <div className="design-color-row">
              <input type="color" className="design-color-swatch" value={c.textColor || '#ffffff'} onChange={e => update({ textColor: e.target.value })} />
              <input className="design-input" value={c.textColor || ''} onChange={e => update({ textColor: e.target.value })} placeholder="#ffffff" style={{ flex: 1 }} />
              {c.textColor && <button onClick={() => update({ textColor: '' })} className="btn-del" title="Resetear" style={{flexShrink:0}}>↺</button>}
            </div>
          </div>
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
          <ColorPickers c={c} update={update} />
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
          <ColorPickers c={c} update={update} />
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
          <ColorPickers c={c} update={update} />
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
                <input
                  className="design-input"
                  value={link.url === '#' ? '' : (link.url || '')}
                  onChange={e=>updateSocialLink(i,'url',e.target.value)}
                  placeholder="https://instagram.com/tu_cuenta"
                  style={{flex:1}}
                />
                <button onClick={()=>removeSocialLink(i)} className="btn-del">×</button>
              </div>
              {link.url && link.url !== '#' && (
                <p style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>✅ Link activo — se abrirá en nueva pestaña</p>
              )}
            </div>
          ))}
          <button onClick={addSocialLink} className="block-btn" style={{justifyContent:'center',color:'var(--accent-2)'}}>+ Agregar red</button>
          <ColorPickers c={c} update={update} />
        </>
      )}

      {/* ─── Stats Row / Chart ─── */}
      {selectedItem.type === 'stats-row' && (() => {
        const statItems  = c.items || [
          { value: '1.2K', label: 'Clientes', raw: 1200 },
          { value: '98%',  label: 'Satisfacción', raw: 98 },
          { value: '5★',   label: 'Calificación', raw: 5 },
          { value: '+200', label: 'Proyectos', raw: 200 },
        ];
        const updateStatItem = (idx, field, val) => {
          const next = statItems.map((s, i) => i === idx ? { ...s, [field]: val } : s);
          update({ items: next });
        };
        const addStatItem    = () => update({ items: [...statItems, { value: '0', label: 'Nueva métrica', raw: 0 }] });
        const removeStatItem = (idx) => update({ items: statItems.filter((_, i) => i !== idx) });

        return (
          <>
            <p className="sidebar-section-title">📊 Estadísticas &amp; Gráficos</p>

            {/* Modo de visualización */}
            <div className="design-field">
              <label className="design-label">Tipo de gráfico</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {[
                  { id: 'counters',  emoji: '🔢', label: 'Contadores' },
                  { id: 'bar',       emoji: '📊', label: 'Barras' },
                  { id: 'pie',       emoji: '🥧', label: 'Torta' },
                  { id: 'doughnut',  emoji: '🍩', label: 'Dona' },
                  { id: 'line',      emoji: '📈', label: 'Línea' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => update({ chartMode: opt.id })}
                    style={{
                      padding: '8px 4px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                      border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      background: (c.chartMode || 'counters') === opt.id ? 'var(--accent-2)' : 'rgba(255,255,255,0.05)',
                      color: (c.chartMode || 'counters') === opt.id ? '#fff' : 'var(--text-secondary)',
                      fontWeight: (c.chartMode || 'counters') === opt.id ? 700 : 400,
                      transition: 'all .2s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Título y subtítulo */}
            <div className="design-field">
              <label className="design-label">Título del bloque</label>
              <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} placeholder="Ej: Nuestros Resultados" />
            </div>
            <div className="design-field">
              <label className="design-label">Subtítulo</label>
              <input className="design-input" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} placeholder="Ej: Datos clave de tu negocio" />
            </div>

            {/* Métricas */}
            <p className="sidebar-section-title">Métricas / Datos</p>
            {statItems.map((s, i) => (
              <div key={i} style={{ marginBottom: 10, background: 'var(--surface)', borderRadius: 10, padding: 10, border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>MÉTRICA {i + 1}</span>
                  {statItems.length > 1 && (
                    <button onClick={() => removeStatItem(i)} className="btn-del">×</button>
                  )}
                </div>
                <input className="design-input" value={s.value} onChange={e => updateStatItem(i, 'value', e.target.value)} placeholder="Ej: 1.2K" style={{ marginBottom: 6 }} />
                <input className="design-input" value={s.label} onChange={e => updateStatItem(i, 'label', e.target.value)} placeholder="Ej: Clientes" style={{ marginBottom: 6 }} />
                <input className="design-input" type="number" value={s.raw ?? 0} onChange={e => updateStatItem(i, 'raw', parseFloat(e.target.value) || 0)} placeholder="Valor numérico (para gráfico)" />
              </div>
            ))}
            <button onClick={addStatItem} className="block-btn" style={{ justifyContent: 'center', color: 'var(--accent-2)' }}>
              + Agregar métrica
            </button>

            {/* Color de acento para gráficos */}
            <div className="design-field" style={{ marginTop: 12 }}>
              <label className="design-label">Color acento (gráfico de línea)</label>
              <div className="design-color-row">
                <input type="color" className="design-color-swatch" value={c.accentColor||'#6366f1'} onChange={e=>update({accentColor:e.target.value})} />
                <input className="design-input" value={c.accentColor||''} onChange={e=>update({accentColor:e.target.value})} placeholder="#6366f1" style={{ flex: 1 }} />
              </div>
            </div>
            <ColorPickers c={c} update={update} />
          </>
        );
      })()}

      {/* Coverage */}

      {selectedItem.type === 'coverage-text' && (
        <>
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Zonas (separadas por coma)</label>
            <input className="design-input" value={(c.zones||[]).join(', ')} onChange={e=>update({zones:e.target.value.split(',').map(z=>z.trim())})} /></div>
          <ColorPickers c={c} update={update} />
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
          <ColorPickers c={c} update={update} />
        </>
      )}

      {/* Image Overlay */}
      {selectedItem.type === 'image-overlay' && (
        <>
          <MediaUploader
            value={c.imageUrl || null}
            onChange={url => update({ imageUrl: url })}
            accept="image"
            label="Imagen de fondo"
          />
          <div className="design-field"><label className="design-label">Título</label>
            <input className="design-input" value={c.title||''} onChange={e=>update({title:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Subtítulo</label>
            <textarea className="design-input" rows="3" value={c.subtitle||''} onChange={e=>update({subtitle:e.target.value})} /></div>
          <div className="design-field"><label className="design-label">Texto del botón (CTA)</label>
            <input className="design-input" value={c.cta||''} onChange={e=>update({cta:e.target.value})} /></div>

          <div className="design-field"><label className="design-label">Color del overlay</label>
            <div className="design-color-row">
              <input type="color" className="design-color-swatch" value={c.overlayColor||'#000000'} onChange={e=>update({overlayColor:e.target.value})} />
              <input className="design-input" value={c.overlayColor||''} onChange={e=>update({overlayColor:e.target.value})} placeholder="#000000" style={{flex:1}} />
            </div>
          </div>

          <div className="design-field"><label className="design-label">Opacidad del overlay: {Math.round((c.overlayOpacity ?? 0.5) * 100)}%</label>
            <input type="range" min="0" max="1" step="0.05" value={c.overlayOpacity ?? 0.5} onChange={e=>update({overlayOpacity:parseFloat(e.target.value)})} style={{width:'100%'}} /></div>

          <div className="design-field"><label className="design-label">Posición del texto</label>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>
              {['top-left','top-center','top-right','center-left','center','center-right','bottom-left','bottom-center','bottom-right'].map(pos=>(
                <button key={pos} onClick={()=>update({textPosition:pos})}
                  style={{padding:'6px 0',borderRadius:6,fontSize:11,border:'none',cursor:'pointer',
                    background:(c.textPosition||'center')===pos ? 'var(--accent-2)' : 'var(--surface)',
                    color:(c.textPosition||'center')===pos ? '#fff' : 'var(--text-secondary)',
                    fontWeight:(c.textPosition||'center')===pos ? 700 : 400,
                  }}>
                  {pos.replace('-',' ')}
                </button>
              ))}
            </div>
          </div>
          <ColorPickers c={c} update={update} />
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
  // ✅ FIX: sólo necesitamos rubro, templateId y selectedItemId del store a nivel Sidebar
  const { rubro, templateId, selectedItemId, selectItem } = useBuilderStore();

  useEffect(() => {
    if (selectedItemId) {
      setTab('design');
    } else if (tab === 'design') {
      // Cuando se deselecciona un bloque, volver automáticamente a "Añadir"
      setTab('add');
    }
  }, [selectedItemId]);

  const handleTabClick = (tId) => {
    if (tId === 'add' || tId === 'page') {
      selectItem(null);
    }
    setTab(tId);
  };

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
            className={`sidebar-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => handleTabClick(t.id)}
            title={t.title}
          >
            {t.label} <span className="sidebar-tab-label">{t.title}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {tab === 'add'    && <TabAdd rubro={rubro} templateId={templateId} />}
        {tab === 'design' && <TabDesign />}
        {tab === 'page'   && <TabPage />}
      </div>
    </div>
  );
}