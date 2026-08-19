const TOOLS = [
  {
    icon: "📂",
    name: "Abrir Arquivo",
    description: "Abre qualquer arquivo do sistema para visualização ou edição.",
    status: "ativo",
    permission: "Leitura de arquivos",
    category: "Sistema",
  },
  {
    icon: "🔍",
    name: "Pesquisar Arquivos",
    description: "Realiza buscas em todo o sistema de arquivos por nome ou conteúdo.",
    status: "ativo",
    permission: "Leitura de arquivos",
    category: "Sistema",
  },
  {
    icon: "📝",
    name: "Criar Nota",
    description: "Cria notas rápidas vinculadas a projetos ou memórias.",
    status: "ativo",
    permission: "Nenhuma",
    category: "Produtividade",
  },
  {
    icon: "🖥️",
    name: "Abrir Programa",
    description: "Abre programas e aplicativos instalados no computador.",
    status: "ativo",
    permission: "Execução de programas",
    category: "Sistema",
  },
  {
    icon: "🌐",
    name: "Pesquisar na Web",
    description: "Realiza pesquisas em mecanismos de busca e retorna resultados relevantes.",
    status: "ativo",
    permission: "Acesso à internet",
    category: "Internet",
  },
  {
    icon: "📊",
    name: "Gerenciar Projetos",
    description: "Cria, edita e organiza projetos e suas informações relacionadas.",
    status: "ativo",
    permission: "Nenhuma",
    category: "Produtividade",
  },
  {
    icon: "📧",
    name: "Ler E-mails",
    description: "Acessa e-mails para resumos e respostas rápidas.",
    status: "inativo",
    permission: "Acesso a e-mail",
    category: "Comunicação",
  },
  {
    icon: "📅",
    name: "Calendário",
    description: "Visualiza e cria eventos no calendário do sistema.",
    status: "inativo",
    permission: "Acesso ao calendário",
    category: "Produtividade",
  },
  {
    icon: "🖱️",
    name: "Controle de Tela",
    description: "Permite que a IA interaja com a interface do usuário para automações.",
    status: "inativo",
    permission: "Controle do mouse e teclado",
    category: "Automação",
  },
];

const CATEGORIES = ["Todos", "Sistema", "Produtividade", "Internet", "Comunicação", "Automação"];

import { useState } from "react";

const statusColors: Record<string, { text: string; bg: string; label: string }> = {
  ativo: { text: "#34d399", bg: "#34d39918", label: "Ativo" },
  inativo: { text: "#9296A8", bg: "#9296A818", label: "Inativo" },
};

export default function ToolsScreen() {
  const [category, setCategory] = useState("Todos");

  const filtered = TOOLS.filter(t => category === "Todos" || t.category === category);

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ background: "#171923", borderBottom: "1px solid #252840" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#F5F5F7" }}>Ferramentas</h1>
            <p className="text-xs mt-0.5" style={{ color: "#9296A8" }}>
              {TOOLS.filter(t => t.status === "ativo").length} ativas · {TOOLS.filter(t => t.status === "inativo").length} inativas
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: category === c ? "#7B61FF" : "#202331",
                color: category === c ? "white" : "#9296A8",
                border: `1px solid ${category === c ? "#7B61FF" : "#252840"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {filtered.map(tool => (
            <div
              key={tool.name}
              className="rounded-xl p-4 flex gap-4 transition-all"
              style={{
                background: "#202331",
                border: "1px solid #252840",
                opacity: tool.status === "inativo" ? 0.7 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = tool.status === "ativo" ? "#7B61FF40" : "#252840")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#252840")}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: "#1a1a2e" }}
              >
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm" style={{ color: "#F5F5F7" }}>{tool.name}</p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: statusColors[tool.status].bg,
                      color: statusColors[tool.status].text,
                    }}
                  >
                    {statusColors[tool.status].label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "#9296A8" }}>{tool.description}</p>
                <div className="flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9296A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-xs" style={{ color: "#9296A8", fontFamily: "var(--font-mono)" }}>
                    {tool.permission}
                  </span>
                </div>
              </div>
              <div className="flex items-start">
                <button
                  className="w-10 h-5 rounded-full transition-all flex-shrink-0 relative"
                  style={{ background: tool.status === "ativo" ? "#7B61FF" : "#252840" }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: tool.status === "ativo" ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
