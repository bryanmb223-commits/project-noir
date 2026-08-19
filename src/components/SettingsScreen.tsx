import { useEffect, useState } from "react";
import { AIService } from "../systems/ai/AIService";
import { useSettings } from "../systems/settings/SettingsContext";
import type { AIStatus } from "../systems/ai/types";

function Toggle({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return <button onClick={() => onChange(!value)} aria-pressed={value} className="w-11 h-6 rounded-full relative" style={{ background: value ? "#7B61FF" : "#252840" }}><span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: value ? 24 : 4 }} /></button>;
}

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-5 py-4" style={{ borderBottom: "1px solid #252840" }}><div className="flex-1"><p className="text-sm font-medium">{title}</p><p className="text-xs mt-1" style={{ color: "#9296A8" }}>{description}</p></div>{children}</div>;
}

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings(); const [aiStatus, setAiStatus] = useState<AIStatus | null>(null); const [shortcut, setShortcut] = useState("");
  useEffect(() => { void AIService.status().then(setAiStatus); }, [settings?.aiProvider]);
  useEffect(() => { if (settings) setShortcut(settings.globalShortcut); }, [settings?.globalShortcut]);
  if (!settings) return <div className="grid place-items-center flex-1">Carregando configurações...</div>;
  return <div className="flex-1 overflow-y-auto p-5 sm:p-8"><div className="max-w-2xl"><h1 className="text-xl font-semibold">Configurações</h1><p className="text-sm mt-1 mb-6" style={{ color: "#9296A8" }}>Preferências persistentes do Project Noir</p>
    <section className="noir-card mb-4"><h2 className="font-semibold mb-2">Personagem</h2><Row title="Mostrar personagem" description="Exibe a Noir no painel contextual"><Toggle value={settings.showCharacter} onChange={value => void updateSettings({ showCharacter: value })} /></Row><Row title="Animações" description="Transição discreta entre expressões"><Toggle value={settings.characterAnimations} onChange={value => void updateSettings({ characterAnimations: value })} /></Row><Row title="Expressões automáticas" description="Permite que respostas alterem o estado visual"><Toggle value={settings.automaticExpressions} onChange={value => void updateSettings({ automaticExpressions: value })} /></Row></section>
    <section className="noir-card mb-4"><h2 className="font-semibold mb-2">Windows</h2><Row title="Iniciar com o Windows" description="Desativado por padrão"><Toggle value={settings.launchAtLogin} onChange={value => void updateSettings({ launchAtLogin: value })} /></Row><Row title="Notificações nativas" description="Autoriza notificações solicitadas pela interface"><Toggle value={settings.notifications} onChange={value => void updateSettings({ notifications: value })} /></Row><Row title="Atalho global" description="Mostra ou oculta a janela"><input className="noir-input w-56" value={shortcut} onChange={event => setShortcut(event.target.value)} onBlur={() => void updateSettings({ globalShortcut: shortcut })} /></Row><button className="noir-secondary-button mt-4" onClick={() => void window.projectNoir?.notifications.show({ title: "Project Noir", body: "Notificações nativas estão funcionando." })}>Testar notificação</button></section>
    <section className="noir-card"><h2 className="font-semibold mb-2">Inteligência artificial</h2><Row title="Provider" description={`Ativo agora: ${aiStatus?.activeProvider ?? "verificando"}`}><select className="noir-input" value={settings.aiProvider} onChange={event => void updateSettings({ aiProvider: event.target.value as NoirSettings["aiProvider"] })}><option value="mock">MockProvider</option><option value="openai">OpenAI</option></select></Row>{settings.aiProvider === "openai" && !aiStatus?.openAIConfigured && <p className="text-xs mt-4" style={{ color: "#f59e0b" }}>OPENAI_API_KEY não configurada; o MockProvider continua ativo.</p>}</section>
  </div></div>;
}
