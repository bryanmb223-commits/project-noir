import type { ReactNode } from "react";
export default function EntityModal({ title, children, onClose, onSubmit }: { title: string; children: ReactNode; onClose: () => void; onSubmit: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "#000a" }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><form className="noir-card w-full max-w-lg" onSubmit={e => { e.preventDefault(); onSubmit(); }}><h2 className="text-lg font-semibold mb-4">{title}</h2><div className="space-y-3">{children}</div><div className="flex justify-end gap-2 mt-5"><button type="button" className="noir-secondary-button" onClick={onClose}>Cancelar</button><button className="noir-primary-button" type="submit">Salvar</button></div></form></div>;
}
