import { useEffect, useState } from "react";
import ToshiAvatar from "./ToshiAvatar";

interface NotificationProps {
  onClose: () => void;
}

export default function Notification({ onClose }: NotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p <= 0) { onClose(); return 0; }
        return p - 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div
      className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        top: 24,
        right: 24,
        width: 340,
        background: "#171923",
        border: "1px solid #7B61FF40",
        boxShadow: "0 0 30px rgba(123,97,255,0.15), 0 16px 40px rgba(0,0,0,0.5)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div className="flex gap-3 px-4 py-4">
        <ToshiAvatar size={40} showStatus />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold" style={{ color: "#7B61FF" }}>Project Noir</p>
            <span className="text-xs" style={{ color: "#9296A8" }}>agora</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#F5F5F7" }}>
            Lembrete: não esqueça de revisar as memórias do projeto Viridion hoje!
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 self-start flex-shrink-0 transition-colors"
          style={{ color: "#9296A8" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9296A8")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: "#252840" }}>
        <div
          className="h-full transition-none"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #7B61FF, #00CFFF)",
          }}
        />
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
