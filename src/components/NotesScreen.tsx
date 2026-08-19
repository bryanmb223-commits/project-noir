import { useEffect, useState } from "react";
import { dataService, type Note, type Task } from "../services/dataService";

type Tab = "notes" | "tasks";
export default function NotesScreen() {
  const [tab, setTab] = useState<Tab>("notes"); const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]); const [tasks, setTasks] = useState<Task[]>([]);
  const reload = async () => { setNotes(await dataService.list<Note>("notes")); setTasks(await dataService.list<Task>("tasks")); };
  useEffect(() => { void reload(); }, []);
  const create = async () => {
    const title = window.prompt(tab === "notes" ? "Título da nota:" : "Título da tarefa:")?.trim(); if (!title) return;
    if (tab === "notes") await dataService.create<Note>("notes", { title, content: window.prompt("Conteúdo:") ?? "" });
    else await dataService.create<Task>("tasks", { title, description: window.prompt("Descrição (opcional):") ?? "", completed: false });
    await reload();
  };
  const editNote = async (note: Note) => { const title = window.prompt("Título:", note.title)?.trim(); if (!title) return; const content = window.prompt("Conteúdo:", note.content) ?? note.content; await dataService.update<Note>("notes", note.id, { title, content }); await reload(); };
  const editTask = async (task: Task) => { const title = window.prompt("Título:", task.title)?.trim(); if (!title) return; await dataService.update<Task>("tasks", task.id, { title, description: window.prompt("Descrição:", task.description ?? "") ?? "" }); await reload(); };
  const remove = async (collection: "notes" | "tasks", id: string) => { if (window.confirm("Excluir este item?")) { await dataService.remove(collection, id); await reload(); } };
  const filteredNotes = notes.filter(note => `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase()));
  const filteredTasks = tasks.filter(task => `${task.title} ${task.description ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="flex flex-col h-full flex-1 overflow-hidden"><header className="px-6 py-4" style={{ background: "#171923", borderBottom: "1px solid #252840" }}><div className="flex items-center gap-2 mb-4"><button onClick={() => setTab("notes")} className={tab === "notes" ? "noir-primary-button" : "noir-secondary-button"}>Notas</button><button onClick={() => setTab("tasks")} className={tab === "tasks" ? "noir-primary-button" : "noir-secondary-button"}>Tarefas</button><button onClick={create} className="noir-primary-button ml-auto">+ Novo</button></div><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Pesquisar..." className="noir-input w-full" /></header>
    <main className="flex-1 overflow-y-auto p-6"><div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
      {tab === "notes" ? filteredNotes.map(note => <article key={note.id} className="noir-card"><h3 className="font-semibold">{note.title}</h3><p className="text-sm my-3 whitespace-pre-wrap" style={{ color: "#b7bac8" }}>{note.content}</p><div className="flex gap-2"><button onClick={() => editNote(note)} className="noir-secondary-button">Editar</button><button onClick={() => remove("notes", note.id)} className="noir-danger-button">Excluir</button></div></article>) : filteredTasks.map(task => <article key={task.id} className="noir-card"><label className="flex gap-3"><input type="checkbox" checked={task.completed} onChange={() => dataService.update<Task>("tasks", task.id, { completed: !task.completed }).then(reload)} /><span className={task.completed ? "line-through opacity-60" : ""}>{task.title}</span></label><p className="text-sm my-3" style={{ color: "#9296A8" }}>{task.description}</p><div className="flex gap-2"><button onClick={() => editTask(task)} className="noir-secondary-button">Editar</button><button onClick={() => remove("tasks", task.id)} className="noir-danger-button">Excluir</button></div></article>)}
    </div></main></div>;
}
