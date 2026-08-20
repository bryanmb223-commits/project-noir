import type { NotesTab, Screen } from "../App";

interface ToolsScreenProps { onNavigate: (screen: Screen) => void; onOpenNotes: (tab: NotesTab, create?: boolean) => void }

const tools = [
  { icon: "📂", name: "Abrir Arquivo", description: "Acesso controlado a arquivos locais.", status: "development" },
  { icon: "🔍", name: "Pesquisar Arquivos", description: "Busca por nome ou conteúdo no computador.", status: "development" },
  { icon: "📝", name: "Criar Nota", description: "Cria uma nota persistente no Project Noir.", status: "available", action: "note" },
  { icon: "🖥️", name: "Abrir Programa", description: "Execução controlada de programas instalados.", status: "development" },
  { icon: "🌐", name: "Pesquisar na Web", description: "Pesquisa na internet a partir da assistente.", status: "development" },
  { icon: "📊", name: "Gerenciar Projetos", description: "Abre a área de projetos persistentes.", status: "available", action: "projects" },
  { icon: "📧", name: "Ler E-mails", description: "Integração futura com um provedor de e-mail.", status: "development" },
] as const;

export default function ToolsScreen({ onNavigate, onOpenNotes }: ToolsScreenProps) {
  const execute = (action?: "note" | "projects") => {
    if (action === "note") onOpenNotes("notes", true);
    if (action === "projects") onNavigate("projects");
  };
  return <div className="flex flex-col h-full flex-1 overflow-hidden">
    <header className="px-6 py-4" style={{ background: "#171923", borderBottom: "1px solid #252840" }}><h1 className="text-lg font-semibold">Ferramentas</h1><p className="text-xs mt-1" style={{ color: "#9296A8" }}>Somente integrações realmente disponíveis podem ser executadas.</p></header>
    <main className="flex-1 overflow-y-auto p-6"><div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))" }}>
      {tools.map(tool => <article key={tool.name} className="noir-card flex gap-3"><span className="text-2xl" aria-hidden="true">{tool.icon}</span><div className="flex-1"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">{tool.name}</h2><span className="text-xs px-2 py-0.5 rounded-full" style={{ color: tool.status === "available" ? "#34d399" : "#9296A8", background: tool.status === "available" ? "#34d39918" : "#9296A818" }}>{tool.status === "available" ? "Disponível" : "Em desenvolvimento"}</span></div><p className="text-xs my-3" style={{ color: "#9296A8" }}>{tool.description}</p>{tool.status === "available" && <button onClick={() => execute(tool.action)} className="noir-secondary-button">Abrir</button>}</div></article>)}
    </div></main>
  </div>;
}
