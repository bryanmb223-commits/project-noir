import { useState } from "react";

type Tab = "notes" | "tasks";

const NOTES = [
  { id: 1, title: "Estrutura de Viridion", content: "Dividir o universo em 5 arcos principais. Cada arco com 3 atos.", project: "Viridion", date: "Hoje" },
  { id: 2, title: "Mecânicas do Flow", content: "XP por habilidades: +10 por prática, +25 por domínio, +50 por maestria.", project: "Flow System", date: "Ontem" },
  { id: 3, title: "Trilha sonora", content: "Referências: Carpenter Brut, Perturbator, Gunship. Dark synth com vocais etéreos.", project: "TMD", date: "3 dias" },
  { id: 4, title: "Fraquezas vampíricas", content: "1. Sal 2. Prata 3. Invitação 4. Luz direta por mais de 1h", project: "Vampire Codex", date: "5 dias" },
  { id: 5, title: "Ideia de história curta", content: "Uma cidade que vive no eterno crepúsculo. Os cidadãos nunca viram o sol nascer.", project: null, date: "1 semana" },
  { id: 6, title: "Personagem novo: Lyra", content: "Garota que coleciona sonhos. Literally. Pode entrar nos sonhos de outros.", project: "Viridion", date: "2 semanas" },
];

const TASKS = [
  { id: 1, done: false, title: "Revisar capítulo 3 de Viridion", project: "Viridion", due: "Hoje, 14:00", priority: "alta" },
  { id: 2, done: false, title: "Criar ficha de Lyra", project: "Viridion", due: "Amanhã", priority: "média" },
  { id: 3, done: true, title: "Gravar rascunho de música", project: "TMD", due: "Concluído", priority: "baixa" },
  { id: 4, done: false, title: "Desenvolver habilidade: Programação avançada", project: "Flow System", due: "Sexta", priority: "alta" },
  { id: 5, done: false, title: "Atualizar enciclopédia vampírica", project: "Vampire Codex", due: "Próxima semana", priority: "baixa" },
  { id: 6, done: true, title: "Definir arco 2 de Viridion", project: "Viridion", due: "Concluído", priority: "alta" },
];

const priorityColors: Record<string, string> = {
  alta: "#f87171",
  média: "#f59e0b",
  baixa: "#34d399",
};

export default function NotesScreen() {
  const [tab, setTab] = useState<Tab>("notes");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(TASKS);

  const filteredNotes = NOTES.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ background: "#171923", borderBottom: "1px solid #252840" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold" style={{ color: "#F5F5F7" }}>
            {tab === "notes" ? "Notas" : "Tarefas"}
          </h1>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "#7B61FF", color: "white", boxShadow: "0 0 12px rgba(123,97,255,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {tab === "notes" ? "Nova nota" : "Nova tarefa"}
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "#202331", width: "fit-content" }}>
          {(["notes", "tasks"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === t ? "#7B61FF" : "transparent",
                color: tab === t ? "white" : "#9296A8",
              }}
            >
              {t === "notes" ? "Notas" : "Tarefas"}
            </button>
          ))}
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9296A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder={`Buscar ${tab === "notes" ? "notas" : "tarefas"}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#202331", border: "1px solid #252840", color: "#F5F5F7" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === "notes" && (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="rounded-xl p-4 cursor-pointer group transition-all"
                style={{ background: "#202331", border: "1px solid #252840" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#7B61FF40")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#252840")}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: "#F5F5F7" }}>{note.title}</h3>
                  <svg className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9296A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#9296A8" }}>{note.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {note.project && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#7B61FF18", color: "#7B61FF" }}>
                        {note.project}
                      </span>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: "#9296A8" }}>{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "tasks" && (
          <div className="flex flex-col gap-2 max-w-2xl">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-xl px-4 py-3 transition-all"
                style={{ background: "#202331", border: "1px solid #252840", opacity: task.done ? 0.6 : 1 }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                  style={{
                    background: task.done ? "#7B61FF" : "transparent",
                    border: task.done ? "none" : "1.5px solid #252840",
                  }}
                >
                  {task.done && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{ color: task.done ? "#9296A8" : "#F5F5F7", textDecoration: task.done ? "line-through" : "none" }}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.project && (
                      <span className="text-xs" style={{ color: "#7B61FF" }}>{task.project}</span>
                    )}
                    <span className="text-xs" style={{ color: "#9296A8" }}>{task.due}</span>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: `${priorityColors[task.priority]}15`,
                    color: priorityColors[task.priority],
                  }}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
