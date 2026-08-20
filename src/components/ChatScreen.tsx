import { useCallback, useEffect, useRef, useState } from "react";
import ToshiAvatar from "./ToshiAvatar";
import { useCharacter } from "../systems/character/CharacterContext";
import { useSettings } from "../systems/settings/SettingsContext";
import { AIService } from "../systems/ai/AIService";
import { dataService, type BaseEntity, type Project } from "../services/dataService";
import type { NotesTab, Screen } from "../App";

interface Conversation extends BaseEntity { title: string; projectId?: string | null }
interface StoredMessage extends BaseEntity { conversationId: string; role: "user" | "ai"; content: string; emotion?: string; provider?: string; interrupted?: boolean; sources?: WebSource[] }
interface ChatScreenProps { onNavigate: (screen: Screen) => void; onOpenNotes: (tab: NotesTab, create?: boolean) => void }
const time = (date: string) => new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const titleFrom = (text: string) => text.replace(/\s+/g, " ").trim().slice(0, 52) || "Nova conversa";

export default function ChatScreen({ onNavigate, onOpenNotes }: ChatScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]); const [activeId, setActiveId] = useState<string | null>(null); const [messages, setMessages] = useState<StoredMessage[]>([]); const [projects, setProjects] = useState<Project[]>([]); const [input, setInput] = useState(""); const [generating, setGenerating] = useState(false); const [phase, setPhase] = useState<"searching" | "responding" | null>(null); const [error, setError] = useState("");
  const active = conversations.find(x => x.id === activeId); const streamRef = useRef<ReturnType<typeof AIService.stream> | null>(null); const endRef = useRef<HTMLDivElement>(null); const activeIdRef = useRef<string | null>(null); const { setCharacterState } = useCharacter(); const { settings } = useSettings();
  const loadConversations = useCallback(async () => { const items = await dataService.list<Conversation>("conversations"); setConversations(items); setActiveId(current => current && items.some(x => x.id === current) ? current : items[0]?.id ?? null); }, []);
  const loadMessages = useCallback(async (id: string | null) => { if (!id) return setMessages([]); const items = await dataService.list<StoredMessage>("messages"); setMessages(items.filter(x => x.conversationId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt))); }, []);
  useEffect(() => { void Promise.all([loadConversations(), dataService.list<Project>("projects").then(setProjects)]); }, [loadConversations]);
  useEffect(() => { activeIdRef.current = activeId; void loadMessages(activeId); }, [activeId, loadMessages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => () => { streamRef.current?.dispose(); void streamRef.current?.cancel(); }, []);

  const newConversation = () => { if (generating) return; setActiveId(null); setMessages([]); setError(""); };
  const rename = async () => { if (!active) return; const title = window.prompt("Nome da conversa:", active.title)?.trim(); if (title) { await dataService.update("conversations", active.id, { title }); await loadConversations(); } };
  const remove = async () => { if (!active || !window.confirm(`Excluir “${active.title}” e suas mensagens?`)) return; await dataService.remove("conversations", active.id); setActiveId(null); await loadConversations(); };
  const executeCommand = (value: string) => { if (value === "/memory") onNavigate("memories"); else if (value === "/projects") onNavigate("projects"); else if (value === "/note") onOpenNotes("notes", true); else if (value === "/task") onOpenNotes("tasks"); else return false; setInput(""); return true; };

  const send = async () => {
    const content = input.trim(); if (!content || generating || executeCommand(content)) return; setInput(""); setError(""); setGenerating(true); setPhase("responding"); if (settings?.automaticExpressions !== false) setCharacterState("thinking");
    let conversation = active;
    try {
      if (!conversation) { conversation = await dataService.create<Conversation>("conversations", { title: titleFrom(content), projectId: null }); setConversations(prev => [conversation!, ...prev]); setActiveId(conversation.id); activeIdRef.current = conversation.id; }
      const user = await dataService.create<StoredMessage>("messages", { conversationId: conversation.id, role: "user", content });
      const placeholder: StoredMessage = { id: `stream-${crypto.randomUUID()}`, conversationId: conversation.id, role: "ai", content: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setMessages(prev => [...prev, user, placeholder]); const targetConversation = conversation.id; let partial = "";
      streamRef.current = AIService.stream({ conversationId: conversation.id, projectId: conversation.projectId ?? undefined, message: content }, async event => {
        if (event.type === "delta") { partial += event.delta ?? ""; if (activeIdRef.current === targetConversation) setMessages(prev => prev.map(x => x.id === placeholder.id ? { ...x, content: partial } : x)); return; }
        if (event.type === "phase") { setPhase(event.phase ?? "responding"); return; }
        if (event.type === "provider-fallback") { setError(`${event.from} indisponível; tentando ${event.to}.`); return; }
        streamRef.current?.dispose(); streamRef.current = null;
        if (event.type === "done" || event.type === "cancelled") {
          const saved = await dataService.create<StoredMessage>("messages", { conversationId: targetConversation, role: "ai", content: partial || "Resposta interrompida.", emotion: event.emotion ?? "neutral", provider: event.provider ?? "unknown", interrupted: event.type === "cancelled", sources: event.sources ?? [] });
          await dataService.update("conversations", targetConversation, {}); if (activeIdRef.current === targetConversation) setMessages(prev => prev.map(x => x.id === placeholder.id ? saved : x));
          if (settings?.automaticExpressions !== false) setCharacterState(event.type === "cancelled" ? "neutral" : event.emotion ?? "neutral");
        } else { setError(event.message ?? "Não foi possível concluir a resposta."); if (activeIdRef.current === targetConversation) setMessages(prev => prev.filter(x => x.id !== placeholder.id)); if (settings?.automaticExpressions !== false) setCharacterState("irritated"); }
        setGenerating(false); setPhase(null); await loadConversations();
      });
    } catch (reason) { setGenerating(false); setPhase(null); setError(reason instanceof Error ? reason.message : "Não foi possível enviar a mensagem."); if (settings?.automaticExpressions !== false) setCharacterState("irritated"); }
  };

  return <div className="flex h-full flex-1 overflow-hidden">
    <aside className="w-52 flex-shrink-0 overflow-y-auto py-3" style={{ background: "#171923", borderRight: "1px solid #252840" }}><div className="px-3 mb-3"><button onClick={newConversation} className="noir-primary-button w-full">+ Nova conversa</button></div>{conversations.map(c => <button key={c.id} onClick={() => !generating && setActiveId(c.id)} className="w-full px-3 py-2 text-left" style={{ background: c.id === activeId ? "#1e1640" : "transparent" }}><span className="block text-sm truncate">{c.title}</span><span className="text-xs" style={{ color: "#9296A8" }}>{time(c.updatedAt)}</span></button>)}</aside>
    <div className="flex flex-col flex-1 min-w-0"><header className="flex items-center gap-2 px-5 py-3" style={{ background: "#171923", borderBottom: "1px solid #252840" }}><div className="flex-1"><p className="text-sm font-semibold">{active?.title ?? "Nova conversa"}</p><select disabled={!active || generating} value={active?.projectId ?? ""} onChange={async e => { if (!active) return; await dataService.update("conversations", active.id, { projectId: e.target.value || null }); await loadConversations(); }} className="bg-transparent text-xs" style={{ color: "#9296A8" }}><option value="">Sem projeto</option>{projects.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}</select></div>{active && <><button className="noir-secondary-button" onClick={() => void rename()}>Renomear</button><button className="noir-danger-button" onClick={() => void remove()}>Excluir</button></>}</header>
      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4">{!messages.length && <p className="text-center mt-16 text-sm" style={{ color: "#9296A8" }}>Comece uma conversa com a Noir. Use /web para forçar uma pesquisa.</p>}{messages.map(m => m.role === "ai" ? <div key={m.id} className="flex gap-3 max-w-2xl"><ToshiAvatar size={32} showStatus={false}/><div className="min-w-0"><span className="text-xs" style={{ color: "#7B61FF" }}>Noir · {time(m.createdAt)}{m.provider ? ` · ${m.provider}` : ""}</span><div className="rounded-xl px-4 py-3 text-sm whitespace-pre-wrap" style={{ background: "#202331", border: "1px solid #252840" }}>{m.content || "…"}{m.interrupted && <span className="block text-xs mt-2" style={{ color: "#f59e0b" }}>Resposta interrompida</span>}{m.sources?.length ? <div className="mt-4 pt-3 space-y-1" style={{ borderTop: "1px solid #34384d" }}><p className="text-xs font-semibold">Fontes</p>{m.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block text-xs truncate" style={{ color: "#8ecbff" }}>{source.source} — {source.title}</a>)}</div> : null}</div></div></div> : <div key={m.id} className="flex justify-end"><div className="rounded-xl px-4 py-3 text-sm max-w-lg whitespace-pre-wrap" style={{ background: "#1e1640", border: "1px solid #7B61FF30" }}>{m.content}</div></div>)}<div ref={endRef}/></main>
      {generating && <p className="px-5 text-xs" style={{ color: "#a78bfa" }}>{phase === "searching" ? "Pesquisando na web..." : "Respondendo..."}</p>}{error && <p role="alert" className="px-5 text-xs" style={{ color: "#f87171" }}>{error}</p>}<footer className="p-5"><div className="flex gap-2"><textarea value={input} disabled={generating} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} rows={2} placeholder="Fale com a Noir... ou use /web" className="noir-input flex-1 resize-none"/>{generating ? <button className="noir-danger-button" onClick={() => void streamRef.current?.cancel()}>Parar</button> : <button disabled={!input.trim()} className="noir-primary-button" onClick={() => void send()}>Enviar</button>}</div></footer>
    </div>
  </div>;
}
