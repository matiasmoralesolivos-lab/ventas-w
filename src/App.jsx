import './index.css';
import { useBuilderStore } from './store/useBuilderStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import OnboardingScreen from './components/OnboardingScreen';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';

export default function App() {
  const rubro = useBuilderStore(s => s.rubro);
  useKeyboardShortcuts();

  // Si no hay rubro elegido, mostrar onboarding
  if (!rubro) return <OnboardingScreen />;

  return (
    <div className="app-shell">
      <TopBar />
      <div className="builder-body">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  );
}