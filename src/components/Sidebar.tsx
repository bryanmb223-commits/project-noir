import type { ReactNode } from "react";
import ToshiAvatar from "./ToshiAvatar";

type Screen = "chat" | "memories" | "projects" | "notes" | "tools" | "settings";

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onMiniMode: () => void;
}

const navItems: { id: Screen; label: string; icon: ReactNode }[] = [
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "memories",
    label: "Memórias",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projetos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Notas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Tarefas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "tools",
    label: "Ferramentas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Configurações",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const quickActions = [
  {
    label: "Mini chat",
    action: "mini",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Arquivos",
    action: "files",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Nova nota",
    action: "note",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    label: "Modo noturno",
    action: "night",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeScreen, onNavigate, onMiniMode }: SidebarProps) {
  const uniqueNavItems = navItems.filter((item, idx, arr) =>
    arr.findIndex(i => i.id === item.id && i.label === item.label) === idx
  );

  return (
    <aside
      className="noir-main-sidebar flex flex-col h-full border-r"
      style={{
        width: 220,
        minWidth: 220,
        background: "#171923",
        borderColor: "#252840",
      }}
    >
      {/* AI identity */}
      <div className="flex flex-col items-center gap-2 px-4 pt-6 pb-4">
        <ToshiAvatar size={64} showStatus />
        <div className="text-center">
          <p className="font-semibold text-sm" style={{ color: "#F5F5F7" }}>
            Noir
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 5px #34d399" }} />
            <span className="text-xs" style={{ color: "#34d399" }}>Online</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: "#252840" }} />

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left"
              style={{
                background: isActive ? "#1e1640" : "transparent",
                color: isActive ? "#7B61FF" : "#9296A8",
                border: isActive ? "1px solid #7B61FF30" : "1px solid transparent",
                boxShadow: isActive ? "0 0 12px rgba(123,97,255,0.1)" : "none",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1a1a2e";
                  (e.currentTarget as HTMLButtonElement).style.color = "#c4b8ff";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#9296A8";
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
              {item.id === "notes" && item.label === "Tarefas" && (
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: "#7B61FF22", color: "#7B61FF", fontSize: 10 }}
                >
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: "#252840" }} />

      {/* Quick actions */}
      <div className="px-3 py-3">
        <p className="text-xs font-medium px-2 mb-2" style={{ color: "#9296A8" }}>
          AÇÕES RÁPIDAS
        </p>
        <div className="grid grid-cols-4 gap-1">
          {quickActions.map(action => (
            <button
              key={action.action}
              title={action.label}
              onClick={() => action.action === "mini" && onMiniMode()}
              className="flex items-center justify-center rounded-lg p-2 transition-all duration-150"
              style={{ background: "#202331", color: "#9296A8" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#252840";
                (e.currentTarget as HTMLButtonElement).style.color = "#7B61FF";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#202331";
                (e.currentTarget as HTMLButtonElement).style.color = "#9296A8";
              }}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Tray minimize */}
      <div className="px-4 pb-4">
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-all duration-150"
          style={{ background: "#202331", color: "#9296A8" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "#F5F5F7";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "#9296A8";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 11 12 6 7 11" />
            <polyline points="17 18 12 13 7 18" />
          </svg>
          Minimizar para bandeja
        </button>
      </div>
    </aside>
  );
}
