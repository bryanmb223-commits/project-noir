import { useState } from "react";

const PROJECTS = [
  {
    id: "viridion",
    emoji: "📚",
    name: "Viridion",
    subtitle: "Universo Literário",
    color: "#7B61FF",
    description: "Um universo de fantasia épica com magia elemental e conflitos entre facções.",
    stats: { docs: 12, chars: 8, events: 24, notes: 31, memories: 15 },
    documents: [
      { name: "Capítulo 1 — O Despertar", type: "doc", date: "Ontem" },
      { name: "Capítulo 2 — O Vale", type: "doc", date: "3 dias" },
      { name: "Capítulo 3 — Os Gêmeos", type: "doc", date: "Hoje" },
      { name: "Mapa do Mundo", type: "file", date: "1 semana" },
    ],
    characters: [
      { name: "Solis", role: "Protagonista", color: "#7B61FF" },
      { name: "Mira", role: "Antagonista", color: "#f472b6" },
      { name: "Kael", role: "Antagonista", color: "#f472b6" },
      { name: "Elowyn", role: "Aliada", color: "#34d399" },
    ],
  },
  {
    id: "flow",
    emoji: "⚔️",
    name: "Flow System",
    subtitle: "RPG",
    color: "#00CFFF",
    description: "Sistema de progressão por pontos de experiência baseado em habilidades reais.",
    stats: { docs: 5, chars: 3, events: 8, notes: 14, memories: 7 },
    documents: [
      { name: "Regras Base", type: "doc", date: "2 dias" },
      { name: "Classes de Personagem", type: "doc", date: "1 semana" },
    ],
    characters: [
      { name: "Guardião", role: "Classe", color: "#00CFFF" },
      { name: "Sombra", role: "Classe", color: "#9296A8" },
    ],
  },
  {
    id: "vampire",
    emoji: "🧛",
    name: "Vampire Codex",
    subtitle: "Enciclopédia Vampírica",
    color: "#f472b6",
    description: "Enciclopédia definitiva sobre vampiros de diversas mitologias e ficções.",
    stats: { docs: 20, chars: 12, events: 5, notes: 8, memories: 11 },
    documents: [
      { name: "Fraquezas e Poderes", type: "doc", date: "5 dias" },
      { name: "Linhagens Vampíricas", type: "doc", date: "2 semanas" },
    ],
    characters: [
      { name: "Drácula", role: "Referência", color: "#f472b6" },
      { name: "Lestat", role: "Referência", color: "#f472b6" },
    ],
  },
  {
    id: "toshi-hub",
    emoji: "🤖",
    name: "Project Noir",
    subtitle: "Meta-projeto",
    color: "#f59e0b",
    description: "Projeto de configuração e evolução da própria Noir.",
    stats: { docs: 4, chars: 0, events: 2, notes: 7, memories: 20 },
    documents: [{ name: "Personalidade da IA", type: "doc", date: "Hoje" }],
    characters: [],
  },
  {
    id: "tmd",
    emoji: "🎵",
    name: "TMD",
    subtitle: "Música",
    color: "#34d399",
    description: "Projeto de composição e produção musical experimental.",
    stats: { docs: 3, chars: 0, events: 6, notes: 5, memories: 4 },
    documents: [{ name: "Faixas em progresso", type: "doc", date: "3 dias" }],
    characters: [],
  },
];

type TabId = "overview" | "documents" | "characters" | "notes" | "memories";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Visão Geral" },
  { id: "documents", label: "Documentos" },
  { id: "characters", label: "Personagens" },
  { id: "notes", label: "Notas" },
  { id: "memories", label: "Memórias" },
];

export default function ProjectsScreen() {
  const [activeId, setActiveId] = useState("viridion");
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const project = PROJECTS.find(p => p.id === activeId)!;

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Project sidebar */}
      <div
        className="flex flex-col h-full overflow-y-auto flex-shrink-0 py-4"
        style={{ width: 200, background: "#171923", borderRight: "1px solid #252840" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider px-4 mb-2" style={{ color: "#9296A8" }}>
          Projetos
        </p>
        {PROJECTS.map(p => (
          <button
            key={p.id}
            onClick={() => { setActiveId(p.id); setActiveTab("overview"); }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-left transition-all"
            style={{
              background: activeId === p.id ? "#1e1640" : "transparent",
              borderLeft: `2px solid ${activeId === p.id ? p.color : "transparent"}`,
            }}
          >
            <span className="text-lg">{p.emoji}</span>
            <div>
              <p className="text-sm font-medium" style={{ color: activeId === p.id ? p.color : "#F5F5F7" }}>{p.name}</p>
              <p className="text-xs" style={{ color: "#9296A8" }}>{p.subtitle}</p>
            </div>
          </button>
        ))}

        <div className="px-4 mt-3">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
            style={{ background: "#202331", color: "#9296A8", border: "1px dashed #252840" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#7B61FF50")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#252840")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Project content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Project header */}
        <div
          className="px-6 py-4 flex-shrink-0"
          style={{ background: "#171923", borderBottom: "1px solid #252840" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{project.emoji}</span>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "#F5F5F7" }}>{project.name}</h1>
              <p className="text-sm" style={{ color: "#9296A8" }}>{project.subtitle}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}30` }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Falar sobre
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? `${project.color}20` : "transparent",
                  color: activeTab === tab.id ? project.color : "#9296A8",
                  borderBottom: activeTab === tab.id ? `2px solid ${project.color}` : "2px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed" style={{ color: "#9296A8" }}>{project.description}</p>

              <div className="grid grid-cols-5 gap-3">
                {Object.entries(project.stats).map(([key, val]) => (
                  <div key={key} className="rounded-xl p-3 text-center" style={{ background: "#202331", border: "1px solid #252840" }}>
                    <p className="text-2xl font-bold" style={{ color: project.color }}>{val}</p>
                    <p className="text-xs mt-1 capitalize" style={{ color: "#9296A8" }}>{key}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="rounded-xl p-4" style={{ background: "#202331", border: "1px solid #252840" }}>
                  <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#9296A8" }}>Documentos Recentes</p>
                  {project.documents.slice(0, 3).map(d => (
                    <div key={d.name} className="flex items-center gap-2 py-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-xs flex-1 truncate" style={{ color: "#F5F5F7" }}>{d.name}</span>
                      <span className="text-xs" style={{ color: "#9296A8" }}>{d.date}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4" style={{ background: "#202331", border: "1px solid #252840" }}>
                  <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#9296A8" }}>Personagens</p>
                  {project.characters.slice(0, 4).map(c => (
                    <div key={c.name} className="flex items-center gap-2 py-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${c.color}20` }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                      </div>
                      <span className="text-xs flex-1" style={{ color: "#F5F5F7" }}>{c.name}</span>
                      <span className="text-xs" style={{ color: "#9296A8" }}>{c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="flex flex-col gap-2">
              {project.documents.map(d => (
                <div key={d.name} className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors" style={{ background: "#202331", border: "1px solid #252840" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${project.color}40`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#252840")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="flex-1 text-sm" style={{ color: "#F5F5F7" }}>{d.name}</span>
                  <span className="text-xs" style={{ color: "#9296A8" }}>{d.date}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "characters" && (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {project.characters.map(c => (
                <div key={c.name} className="rounded-xl p-4" style={{ background: "#202331", border: "1px solid #252840" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${c.color}15` }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#F5F5F7" }}>{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: c.color }}>{c.role}</p>
                </div>
              ))}
              {project.characters.length === 0 && (
                <p className="text-sm col-span-full text-center py-8" style={{ color: "#9296A8" }}>
                  Nenhum personagem registrado
                </p>
              )}
            </div>
          )}

          {(activeTab === "notes" || activeTab === "memories") && (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <p style={{ color: "#9296A8" }} className="text-sm">Conteúdo em breve</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
