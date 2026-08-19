import { useState } from "react";

const FILTERS = ["Todas", "Pessoal", "Projetos", "Preferências", "Pessoas", "Importantes"];

const MEMORIES = [
  {
    content: "Solis possui controle sobre energia solar e pode canalizar calor, luz e energia fotônica em combate. Seu ponto fraco é a escuridão prolongada.",
    category: "Projetos",
    project: "Viridion",
    date: "Hoje, 10:24",
    important: true,
  },
  {
    content: "Prefiro que as respostas sejam concisas e diretas. Evite repetições desnecessárias.",
    category: "Preferências",
    project: null,
    date: "Ontem, 14:00",
    important: false,
  },
  {
    content: "Os gêmeos Mira e Kael possuem sincronização mental — quando um sente dor, o outro também sente.",
    category: "Projetos",
    project: "Viridion",
    date: "Ontem, 09:15",
    important: true,
  },
  {
    content: "Amo música dark ambient e synthwave dos anos 80. Usar isso como referência para trilhas do Flow System.",
    category: "Pessoal",
    project: "Flow System",
    date: "3 dias atrás",
    important: false,
  },
  {
    content: "Vampiros do Codex não morrem com luz solar — apenas enfraquecem. A verdadeira fraqueza é o sal.",
    category: "Projetos",
    project: "Vampire Codex",
    date: "5 dias atrás",
    important: true,
  },
  {
    content: "Rafael é o melhor amigo. Designer gráfico. Adora sci-fi e tocou guitarra até 2020.",
    category: "Pessoas",
    project: null,
    date: "1 semana atrás",
    important: false,
  },
  {
    content: "Usar o sistema de pontos de experiência do Flow para rastrear habilidades reais do usuário.",
    category: "Projetos",
    project: "Flow System",
    date: "1 semana atrás",
    important: false,
  },
  {
    content: "Capítulo 3 de Viridion deve apresentar o antagonista principal antes do final.",
    category: "Projetos",
    project: "Viridion",
    date: "2 semanas atrás",
    important: false,
  },
];

const categoryColors: Record<string, string> = {
  Projetos: "#7B61FF",
  Pessoal: "#00CFFF",
  Preferências: "#f59e0b",
  Pessoas: "#34d399",
  Importantes: "#f472b6",
};

export default function MemoriesScreen() {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  const filtered = MEMORIES.filter(m => {
    if (activeFilter !== "Todas" && activeFilter !== "Importantes" && m.category !== activeFilter) return false;
    if (activeFilter === "Importantes" && !m.important) return false;
    if (search && !m.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ background: "#171923", borderBottom: "1px solid #252840" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#F5F5F7" }}>Memórias</h1>
            <p className="text-xs mt-0.5" style={{ color: "#9296A8" }}>
              {MEMORIES.length} memórias armazenadas
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "#7B61FF", color: "white", boxShadow: "0 0 12px rgba(123,97,255,0.3)" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(123,97,255,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 12px rgba(123,97,255,0.3)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova memória
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9296A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar memórias..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#202331", border: "1px solid #252840", color: "#F5F5F7" }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: activeFilter === f ? "#7B61FF" : "#202331",
                color: activeFilter === f ? "white" : "#9296A8",
                border: `1px solid ${activeFilter === f ? "#7B61FF" : "#252840"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {filtered.map((m, i) => (
            <div
              key={i}
              className="rounded-xl p-4 group relative transition-all duration-200"
              style={{ background: "#202331", border: "1px solid #252840" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#7B61FF40")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#252840")}
            >
              {m.important && (
                <div
                  className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }}
                />
              )}
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#F5F5F7" }}>
                {m.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${categoryColors[m.category] || "#7B61FF"}18`,
                      color: categoryColors[m.category] || "#7B61FF",
                    }}
                  >
                    {m.category}
                  </span>
                  {m.project && (
                    <span className="text-xs" style={{ color: "#9296A8" }}>
                      {m.project}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button style={{ color: "#9296A8" }} onMouseEnter={e => (e.currentTarget.style.color = "#7B61FF")} onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button style={{ color: "#9296A8" }} onMouseEnter={e => (e.currentTarget.style.color = "#f87171")} onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: "#9296A8" }}>{m.date}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#252840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <p style={{ color: "#9296A8" }} className="text-sm">Nenhuma memória encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
