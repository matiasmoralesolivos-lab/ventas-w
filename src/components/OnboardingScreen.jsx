import { useState } from 'react';
import { RUBROS } from '../data/rubrosConfig';
import { useBuilderStore } from '../store/useBuilderStore';

const GRADIENT_COLS = {
  'prev-yellow': ['#fbbf24','#f59e0b'],
  'prev-dark':   ['#374151','#111827'],
  'prev-orange': ['#f97316','#ef4444'],
  'prev-red':    ['#ef4444','#dc2626'],
  'prev-purple': ['#8b5cf6','#ec4899'],
  'prev-blue':   ['#3b82f6','#06b6d4'],
  'prev-teal':   ['#14b8a6','#22c55e'],
  'prev-indigo': ['#6366f1','#8b5cf6'],
  'prev-pink':   ['#ec4899','#f43f5e'],
  'prev-slate':  ['#64748b','#475569'],
};

function TplPreview({ cls }) {
  const [c1, c2] = GRADIENT_COLS[cls] || ['#6366f1','#8b5cf6'];
  return (
    <div className="tpl-preview" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
      <div className="tpl-preview-bar" style={{ height: 28, background: 'rgba(255,255,255,.25)' }} />
      <div style={{ display:'flex', gap:6, flex:1 }}>
        <div className="tpl-preview-bar" style={{ width: 70, background:'rgba(255,255,255,.2)', borderRadius:6 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
          <div className="tpl-preview-bar" style={{ height:'40%', background:'rgba(255,255,255,.15)' }} />
          <div className="tpl-preview-bar" style={{ height:'40%', background:'rgba(255,255,255,.15)' }} />
        </div>
      </div>
      <div className="tpl-preview-bar" style={{ height: 20, background:'rgba(255,255,255,.3)', borderRadius:4 }} />
    </div>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [selectedRubro, setSelectedRubro] = useState(null);
  const [selectedTplId, setSelectedTplId] = useState(null);
  const { setRubroAndTemplate, startBlank } = useBuilderStore();

  const rubroObj = RUBROS.find(r => r.id === selectedRubro);

  function handlePickRubro(id) {
    setSelectedRubro(id);
    setSelectedTplId(null);
  }

  function handleContinue() {
    if (step === 1 && selectedRubro) { setStep(2); }
    else if (step === 2 && selectedTplId) {
      const tpl = rubroObj.templates.find(t => t.id === selectedTplId);
      setRubroAndTemplate(selectedRubro, selectedTplId, tpl.layout);
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-logo">🚀 WAUP</div>
      <p className="onboarding-subtitle">Creá tu página de ventas en minutos</p>

      {step === 1 && (
        <>
          <h2 className="onboarding-title">¿Cuál es tu rubro?</h2>
          <div className="rubro-grid">
            {RUBROS.map(r => (
              <button
                key={r.id}
                className={`rubro-card${selectedRubro === r.id ? ' selected' : ''}`}
                onClick={() => handlePickRubro(r.id)}
              >
                <div className="rubro-card-emoji">{r.emoji}</div>
                <div className="rubro-card-label">{r.label}</div>
                <div className="rubro-card-desc">{r.description}</div>
              </button>
            ))}
          </div>
          <div className="onboarding-actions">
            <button className="btn btn-accent" disabled={!selectedRubro} onClick={handleContinue}>
              Elegir plantilla →
            </button>
          </div>
        </>
      )}

      {step === 2 && rubroObj && (
        <>
          <h2 className="onboarding-title">{rubroObj.emoji} Elegí una plantilla para tu página</h2>
          <div className="template-grid">
            {rubroObj.templates.map(tpl => (
              <button
                key={tpl.id}
                className={`tpl-card${selectedTplId === tpl.id ? ' selected' : ''}`}
                onClick={() => setSelectedTplId(tpl.id)}
              >
                <TplPreview cls={tpl.previewClass} />
                <div className="tpl-card-info">
                  <div className="tpl-card-name">{tpl.name}</div>
                  <div className="tpl-card-desc">{tpl.description}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="onboarding-actions">
            <button className="onboarding-back" onClick={() => setStep(1)}>← Atrás</button>
            <button className="btn btn-accent" disabled={!selectedTplId} onClick={handleContinue}>
              Abrir editor →
            </button>
          </div>
          <button
            className="onboarding-blank"
            style={{ marginTop: 16 }}
            onClick={() => startBlank(selectedRubro)}
          >
            Empezar con página en blanco
          </button>
        </>
      )}
    </div>
  );
}
