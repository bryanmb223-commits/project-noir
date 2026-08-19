import NoirCharacter from "./NoirCharacter";
import { useCharacter } from "../systems/character/CharacterContext";
import { useSettings } from "../systems/settings/SettingsContext";

interface RightPanelProps {
  onClose: () => void;
}

const memories = [
  { icon: "🧠", title: "Poderes do Solis", date: "Hoje" },
  { icon: "📖", title: "Capítulo 3 — estrutura", date: "Ontem" },
  { icon: "🎵", title: "Trilha musical Flow", date: "3 dias atrás" },
  { icon: "🧛", title: "Regras vampíricas", date: "5 dias atrás" },
];

const tasks = [
  { done: false, label: "Revisar capítulo de Viridion", time: "14:00" },
  { done: false, label: "Desenvolver nova habilidade", time: "16:00" },
  { done: true, label: "Gravar música", time: "Concluído" },
  { done: false, label: "Atualizar Vampire Codex", time: "Amanhã" },
];

const projects = [
  { emoji: "📚", name: "Viridion", subtitle: "Universo Literário", color: "#7B61FF" },
  { emoji: "⚔️", name: "Flow System", subtitle: "RPG", color: "#00CFFF" },
  { emoji: "🧛", name: "Vampire Codex", subtitle: "Enciclopédia Vampírica", color: "#f472b6" },
];

export default function RightPanel({ onClose }: RightPanelProps) {
  const { characterState } = useCharacter();
  const { settings } = useSettings();

  return (
    <aside
      className="noir-right-panel flex flex-col h-full overflow-y-auto flex-shrink-0"
      style={{ width: 268, minWidth: 268, background: "#171923", borderLeft: "1px solid #252840" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 flex-shrink-0 sticky top-0"
        style={{ background: "#171923", borderBottom: "1px solid #252840", zIndex: 1 }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9296A8" }}>
          Contexto
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded transition-colors"
          style={{ color: "#9296A8" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3 p-3">
        {settings?.showCharacter !== false && <section className="noir-stage" aria-label="Estado visual da Noir">
          <NoirCharacter state={characterState} animations={settings?.characterAnimations !== false} />
        </section>}

        {/* Memories card */}
        <div className="rounded-xl p-3" style={{ background: "#202331", border: "1px solid #252840" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#7B61FF18" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7B61FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <span className="text-xs font-semibold" style={{ color: "#F5F5F7" }}>Memórias Recentes</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {memories.map(m => (
              <div
                key={m.title}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer transition-colors"
                style={{ background: "#1a1a2e" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#252840")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1a1a2e")}
              >
                <span className="text-base flex-shrink-0">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#F5F5F7" }}>{m.title}</p>
                  <p className="text-xs" style={{ color: "#9296A8" }}>{m.date}</p>
                </div>
                <button style={{ color: "#9296A8" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            className="mt-2 w-full text-xs py-1.5 rounded-lg text-center transition-colors"
            style={{ color: "#7B61FF", background: "#7B61FF10" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#7B61FF20")}
            onMouseLeave={e => (e.currentTarget.style.background = "#7B61FF10")}
          >
            Ver tudo →
          </button>
        </div>

        {/* Tasks card */}
        <div className="rounded-xl p-3" style={{ background: "#202331", border: "1px solid #252840" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#00CFFF18" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00CFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <span className="text-xs font-semibold" style={{ color: "#F5F5F7" }}>Tarefas do Dia</span>
            </div>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: "#00CFFF15", color: "#00CFFF", fontSize: 10 }}
            >
              {tasks.filter(t => !t.done).length} restantes
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer"
                  style={{
                    background: t.done ? "#7B61FF" : "transparent",
                    border: t.done ? "none" : "1.5px solid #252840",
                  }}
                >
                  {t.done && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: t.done ? "#9296A8" : "#F5F5F7", textDecoration: t.done ? "line-through" : "none" }}
                  >
                    {t.label}
                  </p>
                  <p className="text-xs" style={{ color: "#9296A8" }}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-2 w-full text-xs py-1.5 rounded-lg text-center transition-colors"
            style={{ color: "#00CFFF", background: "#00CFFF10" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#00CFFF20")}
            onMouseLeave={e => (e.currentTarget.style.background = "#00CFFF10")}
          >
            Ver todas →
          </button>
        </div>

        {/* Projects card */}
        <div className="rounded-xl p-3" style={{ background: "#202331", border: "1px solid #252840" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#f472b618" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span className="text-xs font-semibold" style={{ color: "#F5F5F7" }}>Projetos Ativos</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {projects.map(p => (
              <div
                key={p.name}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer transition-colors"
                style={{ background: "#1a1a2e" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#252840")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1a1a2e")}
              >
                <span className="text-base">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "#F5F5F7" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "#9296A8" }}>{p.subtitle}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
              </div>
            ))}
          </div>

          <button
            className="mt-2 w-full text-xs py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1"
            style={{ color: "#f472b6", background: "#f472b610", border: "1px dashed #f472b630" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f472b620")}
            onMouseLeave={e => (e.currentTarget.style.background = "#f472b610")}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Projeto
          </button>
        </div>
      </div>
    </aside>
  );
}
