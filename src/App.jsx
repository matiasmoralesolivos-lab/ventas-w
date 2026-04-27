import './index.css';
import { useBuilderStore } from './store/useBuilderStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import OnboardingScreen from './components/OnboardingScreen';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';

export default function App() {
  const rubro = useBuilderStore(s => s.rubro);
  const isPreviewMode = useBuilderStore(s => s.isPreviewMode);
  useKeyboardShortcuts();

  // Si no hay rubro elegido, mostrar onboarding
  if (!rubro) return <OnboardingScreen />;

  return (
    <div className={`app-shell${isPreviewMode ? ' app-preview' : ''}`}>
      <TopBar />
      <div className="builder-body">
        <Canvas />
        {!isPreviewMode && <Sidebar />}
      </div>
    </div>
  );
}