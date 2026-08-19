import React, { useState, useRef, useEffect } from "react";
import ToshiAvatar from "./ToshiAvatar";
import { useCharacter } from "../systems/character/CharacterContext";
import { AIService } from "../systems/ai/AIService";
import { useSettings } from "../systems/settings/SettingsContext";

interface Message {
  id: number;
  role: "ai" | "user";
  content: string;
  time: string;
  cards?: ContextCard[];
}

interface ContextCard {
  type: "character" | "project" | "memory" | "file" | "note";
  title: string;
  subtitle: string;
  tags: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    content: "Olá! Estou aqui e pronta para ajudar. O que você precisa hoje?",
    time: "10:22",
  },
  {
    id: 2,
    role: "user",
    content: "Quero organizar as informações sobre Solis e os gêmeos",
    time: "10:23",
  },
  {
    id: 3,
    role: "ai",
    content: "Claro! Vamos revisar o que já temos sobre eles. Encontrei alguns registros relevantes no projeto Viridion.",
    time: "10:23",
    cards: [
      {
        type: "character",
        title: "Solis",
        subtitle: "Personagem — Viridion",
        tags: ["Protagonista", "Mago Solar", "Capítulo 3"],
      },
      {
        type: "character",
        title: "Os Gêmeos",
        subtitle: "Personagens — Viridion",
        tags: ["Antagonistas", "Sincronizados", "Arco 2"],
      },
    ],
  },
  {
    id: 4,
    role: "user",
    content: "Quais são os poderes principais do Solis?",
    time: "10:24",
  },
  {
    id: 5,
    role: "ai",
    content: "Com base nas memórias que registrei, o Solis possui controle sobre energia solar — ele pode canalizar calor, luz e fotônica em combate. Seu ponto fraco é a escuridão prolongada.",
    time: "10:24",
    cards: [
      {
        type: "memory",
        title: "Habilidades do Solis",
        subtitle: "Memória — há 3 dias",
        tags: ["Magia Solar", "Combate", "Fraquezas"],
      },
    ],
  },
];

const COMMANDS = ["/memory", "/projects", "/open", "/note", "/task", "/help"];

const typeIcons: Record<string, React.ReactNode> = {
  character: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
  ),
  project: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  memory: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
  ),
  file: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
  note: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
};

const typeColors: Record<string, string> = {
  character: "#7B61FF",
  project: "#00CFFF",
  memory: "#f59e0b",
  file: "#34d399",
  note: "#f472b6",
};

function ContextCardEl({ card }: { card: ContextCard }) {
  return (
    <div
      className="rounded-lg p-3 mt-2 flex gap-2.5"
      style={{ background: "#1a1530", border: "1px solid #252840" }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${typeColors[card.type]}18`, color: typeColors[card.type] }}
      >
        {typeIcons[card.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "#F5F5F7" }}>{card.title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#9296A8" }}>{card.subtitle}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {card.tags.map(t => (
            <span
              key={t}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: `${typeColors[card.type]}15`, color: typeColors[card.type], fontSize: 10 }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setCharacterState } = useCharacter();
  const { settings } = useSettings();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    if (settings?.automaticExpressions !== false) setCharacterState("thinking");

    const responseId = Date.now() + 1;
    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      let streamedContent = "";
      setIsTyping(false);
      setMessages(prev => [...prev, { id: responseId, role: "ai", content: "", time: "agora" }]);
      const response = await AIService.generate(history, delta => {
        streamedContent += delta;
        setMessages(prev => prev.map(message => message.id === responseId ? { ...message, content: streamedContent } : message));
      });
      if (settings?.automaticExpressions !== false) setCharacterState(response.emotion);
    } catch (error) {
      setIsTyping(false);
      if (settings?.automaticExpressions !== false) setCharacterState("irritated");
      setMessages(prev => prev.map(message => message.id === responseId ? {
        ...message,
        content: error instanceof Error ? error.message : "Não consegui concluir essa solicitação.",
      } : message));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0"
        style={{ background: "#171923", borderBottom: "1px solid #252840" }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#9296A8" }}>
              Chat Atual
            </span>
            <span className="w-px h-3" style={{ background: "#252840" }} />
            <span className="font-semibold text-sm" style={{ color: "#F5F5F7" }}>Viridion</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: "#7B61FF18", color: "#7B61FF", fontSize: 10 }}
            >
              Projeto
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { label: "Selecionar contexto", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
            { label: "Pesquisar", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
            { label: "Fixar", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
            { label: "Opções", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
          ].map(btn => (
            <button
              key={btn.label}
              title={btn.label}
              className="p-2 rounded-lg transition-colors duration-150"
              style={{ color: "#9296A8" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#7B61FF")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map(msg =>
          msg.role === "ai" ? (
            <div key={msg.id} className="flex gap-3 max-w-2xl">
              <ToshiAvatar size={32} showStatus={false} />
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: "#7B61FF" }}>Noir</span>
                  <span className="text-xs" style={{ color: "#9296A8" }}>{msg.time}</span>
                </div>
                <div
                  className="rounded-xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                  style={{ background: "#202331", color: "#F5F5F7", border: "1px solid #252840" }}
                >
                  {msg.content}
                  {msg.cards?.map((card, i) => (
                    <ContextCardEl key={i} card={card} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <div className="flex flex-col items-end gap-1 max-w-lg">
                <span className="text-xs" style={{ color: "#9296A8" }}>{msg.time}</span>
                <div
                  className="rounded-xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
                  style={{ background: "#1e1640", color: "#F5F5F7", border: "1px solid #7B61FF30" }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          )
        )}

        {isTyping && (
          <div className="flex gap-3 max-w-2xl">
            <ToshiAvatar size={32} showStatus={false} />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: "#7B61FF" }}>Noir</span>
              </div>
              <div
                className="rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center"
                style={{ background: "#202331", border: "1px solid #252840" }}
              >
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#7B61FF",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Commands */}
      <div
        className="px-5 pt-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0"
        style={{ borderTop: "1px solid #252840" }}
      >
        {COMMANDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => setInput(prev => (prev ? prev + " " + cmd : cmd))}
            className="text-xs px-2.5 py-1 rounded-full transition-all duration-150"
            style={{
              background: "#202331",
              color: "#9296A8",
              border: "1px solid #252840",
              fontFamily: "var(--font-mono)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "#1e1640";
              (e.currentTarget as HTMLButtonElement).style.color = "#7B61FF";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#7B61FF40";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "#202331";
              (e.currentTarget as HTMLButtonElement).style.color = "#9296A8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#252840";
            }}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 pb-4 flex-shrink-0">
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-3"
          style={{ background: "#202331", border: "1px solid #252840" }}
          onFocus={() => {}}
        >
          <button
            className="p-1.5 rounded-lg transition-colors duration-150 flex-shrink-0"
            style={{ color: "#9296A8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#7B61FF")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Fale com a Noir..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
            style={{
              color: "#F5F5F7",
              maxHeight: 120,
              fontFamily: "var(--font-sans)",
            }}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="p-1.5 rounded-lg transition-colors duration-150"
              style={{ color: "#9296A8" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#7B61FF")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg transition-all duration-150 flex-shrink-0"
              style={{
                background: input.trim() ? "#7B61FF" : "#252840",
                color: input.trim() ? "white" : "#9296A8",
                boxShadow: input.trim() ? "0 0 12px rgba(123,97,255,0.3)" : "none",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
