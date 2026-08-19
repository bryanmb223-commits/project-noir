import { useState } from "react";
import type { ReactNode } from "react";

type Section = "geral" | "aparencia" | "ia" | "memoria" | "ferramentas" | "permissoes" | "backup" | "sobre";

const SECTIONS: { id: Section; label: string; icon: ReactNode }[] = [
  { id: "geral", label: "Geral", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { id: "aparencia", label: "Aparência", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg> },
  { id: "ia", label: "IA & Modelo", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { id: "memoria", label: "Memória", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
  { id: "ferramentas", label: "Ferramentas", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
  { id: "permissoes", label: "Permissões", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { id: "backup", label: "Backup", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
  { id: "sobre", label: "Sobre", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
];

const ACCENT_COLORS = ["#7B61FF", "#00CFFF", "#f472b6", "#34d399", "#f59e0b", "#f87171"];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
      style={{ background: enabled ? "#7B61FF" : "#252840" }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: enabled ? "calc(100% - 18px)" : "2px" }}
      />
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid #252840" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "#F5F5F7" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "#9296A8" }}>{description}</p>}
      </div>
      <div className="flex-shrink-0 ml-6">{children}</div>
    </div>
  );
}

export default function SettingsScreen() {
  const [section, setSection] = useState<Section>("aparencia");
  const [accentColor, setAccentColor] = useState("#7B61FF");

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Settings sidebar */}
      <div
        className="flex flex-col h-full overflow-y-auto flex-shrink-0 py-4"
        style={{ width: 200, background: "#171923", borderRight: "1px solid #252840" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider px-4 mb-2" style={{ color: "#9296A8" }}>
          Configurações
        </p>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all"
            style={{
              background: section === s.id ? "#1e1640" : "transparent",
              color: section === s.id ? "#7B61FF" : "#9296A8",
              borderLeft: `2px solid ${section === s.id ? "#7B61FF" : "transparent"}`,
            }}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {section === "aparencia" && (
          <div className="max-w-xl">
            <h2 className="text-base font-semibold mb-1" style={{ color: "#F5F5F7" }}>Aparência</h2>
            <p className="text-xs mb-6" style={{ color: "#9296A8" }}>Personalize a interface da Noir</p>

            <SettingRow label="Tema" description="Escolha entre modo claro e escuro">
              <div className="flex gap-2">
                {["Dark", "Light"].map(t => (
                  <button
                    key={t}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: t === "Dark" ? "#7B61FF" : "#202331",
                      color: t === "Dark" ? "white" : "#9296A8",
                      border: `1px solid ${t === "Dark" ? "#7B61FF" : "#252840"}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Cor Principal" description="Cor de destaque da interface">
              <div className="flex gap-2">
                {ACCENT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setAccentColor(c)}
                    className="w-6 h-6 rounded-full transition-all"
                    style={{
                      background: c,
                      border: accentColor === c ? `2px solid white` : "2px solid transparent",
                      boxShadow: accentColor === c ? `0 0 8px ${c}` : "none",
                    }}
                  />
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Transparência" description="Efeitos de translucidez nos painéis">
              <Toggle enabled={false} />
            </SettingRow>

            <SettingRow label="Animações" description="Transições e efeitos de movimento">
              <Toggle enabled={true} />
            </SettingRow>

            <SettingRow label="Tamanho da Interface">
              <div className="flex gap-2">
                {["Pequeno", "Padrão", "Grande"].map((s, i) => (
                  <button
                    key={s}
                    className="px-2.5 py-1 rounded text-xs transition-all"
                    style={{
                      background: i === 1 ? "#7B61FF18" : "#202331",
                      color: i === 1 ? "#7B61FF" : "#9296A8",
                      border: `1px solid ${i === 1 ? "#7B61FF30" : "#252840"}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Glow do Avatar" description="Brilho roxo ao redor do avatar">
              <Toggle enabled={true} />
            </SettingRow>
          </div>
        )}

        {section === "ia" && (
          <div className="max-w-xl">
            <h2 className="text-base font-semibold mb-1" style={{ color: "#F5F5F7" }}>IA & Modelo</h2>
            <p className="text-xs mb-6" style={{ color: "#9296A8" }}>Configure o comportamento da inteligência artificial</p>

            <SettingRow label="Modelo">
              <select className="text-sm px-3 py-1.5 rounded-lg outline-none" style={{ background: "#202331", color: "#F5F5F7", border: "1px solid #252840" }}>
                <option>GPT-4o</option>
                <option>Claude 3.5</option>
                <option>Gemini Pro</option>
                <option>Local (Llama)</option>
              </select>
            </SettingRow>

            <SettingRow label="Nome da IA">
              <input
                type="text"
                defaultValue="Noir"
                className="text-sm px-3 py-1.5 rounded-lg outline-none w-32"
                style={{ background: "#202331", color: "#F5F5F7", border: "1px solid #252840" }}
              />
            </SettingRow>

            <SettingRow label="Memória automática" description="Salvar informações automaticamente">
              <Toggle enabled={true} />
            </SettingRow>

            <SettingRow label="Resposta por voz" description="Ativar síntese de voz nas respostas">
              <Toggle enabled={false} />
            </SettingRow>
          </div>
        )}

        {section === "geral" && (
          <div className="max-w-xl">
            <h2 className="text-base font-semibold mb-1" style={{ color: "#F5F5F7" }}>Geral</h2>
            <p className="text-xs mb-6" style={{ color: "#9296A8" }}>Configurações gerais da aplicação</p>

            <SettingRow label="Iniciar com o sistema">
              <Toggle enabled={true} />
            </SettingRow>
            <SettingRow label="Minimizar na bandeja ao fechar">
              <Toggle enabled={true} />
            </SettingRow>
            <SettingRow label="Notificações">
              <Toggle enabled={true} />
            </SettingRow>
            <SettingRow label="Idioma">
              <select className="text-sm px-3 py-1.5 rounded-lg outline-none" style={{ background: "#202331", color: "#F5F5F7", border: "1px solid #252840" }}>
                <option>Português (BR)</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </SettingRow>
          </div>
        )}

        {section === "sobre" && (
          <div className="max-w-xl">
            <h2 className="text-base font-semibold mb-1" style={{ color: "#F5F5F7" }}>Sobre</h2>
            <div className="mt-6 rounded-xl p-6 text-center" style={{ background: "#202331", border: "1px solid #252840" }}>
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#7B61FF" }}>Project Noir</h3>
              <p className="text-xs mb-4" style={{ color: "#9296A8" }}>Versão 0.1.0 · Build 2024.1</p>
              <p className="text-xs leading-relaxed" style={{ color: "#9296A8" }}>
                Assistente pessoal de inteligência artificial que vive no seu computador. Memórias, projetos, criatividade — tudo em um só lugar.
              </p>
            </div>
          </div>
        )}

        {!["aparencia", "ia", "geral", "sobre"].includes(section) && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p style={{ color: "#9296A8" }} className="text-sm">Seção em desenvolvimento</p>
          </div>
        )}
      </div>
    </div>
  );
}
