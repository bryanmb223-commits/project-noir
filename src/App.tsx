import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatScreen from "./components/ChatScreen";
import RightPanel from "./components/RightPanel";
import MemoriesScreen from "./components/MemoriesScreen";
import ProjectsScreen from "./components/ProjectsScreen";
import NotesScreen from "./components/NotesScreen";
import ToolsScreen from "./components/ToolsScreen";
import SettingsScreen from "./components/SettingsScreen";
import MiniMode from "./components/MiniMode";
import Notification from "./components/Notification";
import PermissionDialog from "./components/PermissionDialog";
import { CharacterProvider } from "./systems/character/CharacterContext";

type Screen = "chat" | "memories" | "projects" | "notes" | "tools" | "settings";

export default function App() {
  const [screen, setScreen] = useState<Screen>("chat");
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [showMini, setShowMini] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showPerm, setShowPerm] = useState(false);

  // Show notification after 3s for demo
  useEffect(() => {
    const t = setTimeout(() => setShowNotif(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <CharacterProvider>
    <div
      className="flex h-full w-full overflow-hidden select-none"
      style={{ background: "#0F1117", fontFamily: "var(--font-sans)" }}
    >
      {/* Sidebar */}
      <Sidebar
        activeScreen={screen}
        onNavigate={setScreen}
        onMiniMode={() => setShowMini(true)}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {screen === "chat" && (
          <>
            <ChatScreen />
            {rightPanelVisible && (
              <RightPanel onClose={() => setRightPanelVisible(false)} />
            )}
            {!rightPanelVisible && (
              <button
                onClick={() => setRightPanelVisible(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-l-lg z-10 transition-all"
                style={{ background: "#202331", color: "#9296A8", border: "1px solid #252840", borderRight: "none" }}
                title="Abrir painel contextual"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}
          </>
        )}
        {screen === "memories" && <MemoriesScreen />}
        {screen === "projects" && <ProjectsScreen />}
        {screen === "notes" && <NotesScreen />}
        {screen === "tools" && <ToolsScreen />}
        {screen === "settings" && <SettingsScreen />}
      </div>

      {/* Demo controls */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full z-40"
        style={{ background: "#171923", border: "1px solid #252840", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
      >
        <span className="text-xs mr-1" style={{ color: "#9296A8" }}>Demo:</span>
        <button
          onClick={() => setShowMini(p => !p)}
          className="text-xs px-2.5 py-1 rounded-full transition-colors"
          style={{ background: showMini ? "#7B61FF22" : "#202331", color: showMini ? "#7B61FF" : "#9296A8" }}
        >
          Mini
        </button>
        <button
          onClick={() => setShowNotif(true)}
          className="text-xs px-2.5 py-1 rounded-full transition-colors"
          style={{ background: "#202331", color: "#9296A8" }}
        >
          Notif
        </button>
        <button
          onClick={() => setShowPerm(true)}
          className="text-xs px-2.5 py-1 rounded-full transition-colors"
          style={{ background: "#202331", color: "#9296A8" }}
        >
          Permissão
        </button>
      </div>

      {/* Overlays */}
      {showMini && <MiniMode onClose={() => setShowMini(false)} />}
      {showNotif && <Notification onClose={() => setShowNotif(false)} />}
      {showPerm && <PermissionDialog onClose={() => setShowPerm(false)} />}
    </div>
    </CharacterProvider>
  );
}
