import ToshiAvatar from "./ToshiAvatar";

interface PermissionDialogProps {
  onClose: () => void;
}

export default function PermissionDialog({ onClose }: PermissionDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          width: 420,
          background: "#171923",
          border: "1px solid #7B61FF40",
          boxShadow: "0 0 60px rgba(123,97,255,0.2), 0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ background: "#1e1640", borderBottom: "1px solid #252840" }}
        >
          <ToshiAvatar size={40} showStatus={false} />
          <div>
            <p className="font-semibold text-sm" style={{ color: "#F5F5F7" }}>Project Noir</p>
            <p className="text-xs" style={{ color: "#9296A8" }}>Solicitação de permissão</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full" style={{ background: "#f59e0b", boxShadow: "0 0 8px #f59e0b" }} />
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm font-medium mb-4" style={{ color: "#F5F5F7" }}>
            Project Noir deseja acessar:
          </p>

          <div
            className="rounded-lg px-3 py-3 mb-4 flex items-start gap-2"
            style={{ background: "#202331", border: "1px solid #252840" }}
          >
            <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9296A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span
              className="text-sm"
              style={{ color: "#00CFFF", fontFamily: "var(--font-mono)" }}
            >
              C:\Users\Toshi\Documents\Projetos
            </span>
          </div>

          <div className="rounded-lg px-3 py-3 mb-5" style={{ background: "#202331", border: "1px solid #252840" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9296A8" }}>Motivo</p>
            <p className="text-sm" style={{ color: "#F5F5F7" }}>
              "Pesquisa de arquivos solicitada por você"
            </p>
          </div>

          <div
            className="flex items-start gap-2 rounded-lg px-3 py-2 mb-5"
            style={{ background: "#f59e0b12", border: "1px solid #f59e0b30" }}
          >
            <svg className="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: "#f59e0b" }}>
              A IA terá acesso de leitura à pasta selecionada. Você pode revogar a permissão a qualquer momento nas configurações.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#202331", color: "#F5F5F7", border: "1px solid #252840" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#f87171")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#252840")}
            >
              Negar
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "#7B61FF",
                color: "white",
                boxShadow: "0 0 16px rgba(123,97,255,0.35)",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(123,97,255,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 16px rgba(123,97,255,0.35)")}
            >
              Permitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
