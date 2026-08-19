import { useState } from "react";
import ToshiAvatar from "./ToshiAvatar";

interface MiniModeProps {
  onClose: () => void;
}

export default function MiniMode({ onClose }: MiniModeProps) {
  const [input, setInput] = useState("");
  const [pinned, setPinned] = useState(false);

  return (
    <div
      className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        bottom: 32,
        right: 32,
        width: 320,
        background: "#171923",
        border: "1px solid #7B61FF40",
        boxShadow: "0 0 40px rgba(123,97,255,0.2), 0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: "#1e1640", borderBottom: "1px solid #252840" }}
      >
        <ToshiAvatar size={36} showStatus />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "#F5F5F7" }}>Noir</p>
          <p className="text-xs" style={{ color: "#34d399" }}>Online · Pronta</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPinned(p => !p)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: pinned ? "#7B61FF" : "#9296A8" }}
            title={pinned ? "Desafixar" : "Fixar janela"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#9296A8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Message bubble */}
      <div className="px-4 py-3">
        <div className="rounded-xl px-3 py-2.5 text-xs leading-relaxed" style={{ background: "#202331", border: "1px solid #252840", color: "#9296A8" }}>
          Como posso ajudar? Estou aqui para o que precisar.
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "#202331", border: "1px solid #252840" }}
        >
          <input
            type="text"
            placeholder="Pergunte algo..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: "#F5F5F7" }}
          />
          <button style={{ color: "#9296A8" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <button
            className="p-1.5 rounded-lg"
            style={{ background: input ? "#7B61FF" : "#252840", color: "white" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Purple accent line */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #7B61FF, transparent)" }} />
    </div>
  );
}
