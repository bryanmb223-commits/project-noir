import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatScreen from "./components/ChatScreen";
import RightPanel from "./components/RightPanel";
import MemoriesScreen from "./components/MemoriesScreen";
import ProjectsScreen from "./components/ProjectsScreen";
import NotesScreen from "./components/NotesScreen";
import ToolsScreen from "./components/ToolsScreen";
import SettingsScreen from "./components/SettingsScreen";
import MiniMode from "./components/MiniMode";
import { CharacterProvider } from "./systems/character/CharacterContext";
import { SettingsProvider } from "./systems/settings/SettingsContext";

export type Screen = "chat" | "memories" | "projects" | "notes" | "tools" | "settings";
export type NotesTab = "notes" | "tasks";

export default function App() {
  const [screen, setScreen] = useState<Screen>("chat");
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [showMini, setShowMini] = useState(false);
  const [notesTab, setNotesTab] = useState<NotesTab>("notes");
  const [newNoteRequest, setNewNoteRequest] = useState(0);

  const openNotes = (tab: NotesTab, create = false) => {
    setNotesTab(tab);
    setScreen("notes");
    if (create && tab === "notes") setNewNoteRequest(value => value + 1);
  };

  return (
    <SettingsProvider>
      <CharacterProvider>
        <div className="flex h-full w-full overflow-hidden select-none" style={{ background: "#0F1117", fontFamily: "var(--font-sans)" }}>
          <Sidebar activeScreen={screen} activeNotesTab={notesTab} onNavigate={setScreen} onOpenNotes={openNotes} onMiniMode={() => setShowMini(true)} />
          <div className="flex flex-1 min-w-0 overflow-hidden">
            {screen === "chat" && <>
              <ChatScreen onNavigate={setScreen} onOpenNotes={openNotes} />
              {rightPanelVisible
                ? <RightPanel onClose={() => setRightPanelVisible(false)} />
                : <button onClick={() => setRightPanelVisible(true)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-l-lg z-10" style={{ background: "#202331", color: "#9296A8", border: "1px solid #252840", borderRight: "none" }} title="Abrir painel contextual">‹</button>}
            </>}
            {screen === "memories" && <MemoriesScreen />}
            {screen === "projects" && <ProjectsScreen />}
            {screen === "notes" && <NotesScreen initialTab={notesTab} createRequest={newNoteRequest} onTabChange={setNotesTab} onCreateRequestHandled={() => setNewNoteRequest(0)} />}
            {screen === "tools" && <ToolsScreen onNavigate={setScreen} onOpenNotes={openNotes} />}
            {screen === "settings" && <SettingsScreen />}
          </div>
          {showMini && <MiniMode onClose={() => setShowMini(false)} />}
        </div>
      </CharacterProvider>
    </SettingsProvider>
  );
}
