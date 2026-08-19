import { useEffect, useState } from "react";
import { dataService, type Project } from "../services/dataService";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = projects.find(project => project.id === activeId) ?? projects[0];
  const reload = () => dataService.list<Project>("projects").then(items => { setProjects(items); setActiveId(current => current ?? items[0]?.id ?? null); });
  useEffect(() => { void reload(); }, []);

  const createProject = async () => {
    const name = window.prompt("Nome do projeto:")?.trim();
    if (!name) return;
    const description = window.prompt("Descrição (opcional):")?.trim() || "";
    const created = await dataService.create<Project>("projects", { name, description });
    await reload(); setActiveId(created.id);
  };
  const editProject = async () => {
    if (!active) return;
    const name = window.prompt("Nome do projeto:", active.name)?.trim();
    if (!name) return;
    const description = window.prompt("Descrição:", active.description ?? "") ?? "";
    await dataService.update<Project>("projects", active.id, { name, description }); await reload();
  };
  const removeProject = async () => {
    if (!active || !window.confirm(`Excluir “${active.name}”?`)) return;
    await dataService.remove("projects", active.id); setActiveId(null); await reload();
  };

  return <div className="flex h-full flex-1 overflow-hidden noir-responsive-split">
    <aside className="noir-subnav flex flex-col h-full overflow-y-auto flex-shrink-0 py-4" style={{ width: 220, background: "#171923", borderRight: "1px solid #252840" }}>
      <div className="flex items-center justify-between px-4 mb-3"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9296A8" }}>Projetos</span><button onClick={createProject} className="text-lg" style={{ color: "#7B61FF" }}>+</button></div>
      {projects.map(project => <button key={project.id} onClick={() => setActiveId(project.id)} className="px-4 py-3 text-left" style={{ background: active?.id === project.id ? "#1e1640" : "transparent", borderLeft: `2px solid ${active?.id === project.id ? "#7B61FF" : "transparent"}` }}><p className="text-sm font-medium" style={{ color: "#F5F5F7" }}>{project.name}</p><p className="text-xs truncate" style={{ color: "#9296A8" }}>{project.description || "Sem descrição"}</p></button>)}
      {!projects.length && <p className="px-4 py-6 text-xs" style={{ color: "#9296A8" }}>Nenhum projeto criado.</p>}
    </aside>
    <main className="flex-1 overflow-y-auto p-6">
      {active ? <div className="max-w-3xl"><div className="flex flex-wrap items-start gap-3 mb-6"><div className="flex-1"><h1 className="text-xl font-semibold">{active.name}</h1><p className="text-sm mt-2" style={{ color: "#9296A8" }}>{active.description || "Sem descrição."}</p></div><button onClick={editProject} className="noir-secondary-button">Editar</button><button onClick={removeProject} className="noir-danger-button">Excluir</button></div><div className="rounded-xl p-5" style={{ background: "#202331", border: "1px solid #252840" }}><p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#9296A8" }}>Dados persistentes</p><p className="text-sm">Criado em {new Date(active.createdAt).toLocaleString("pt-BR")}</p><p className="text-sm mt-1">Atualizado em {new Date(active.updatedAt).toLocaleString("pt-BR")}</p></div></div> : <div className="h-full grid place-items-center"><button onClick={createProject} className="noir-primary-button">Criar primeiro projeto</button></div>}
    </main>
  </div>;
}
