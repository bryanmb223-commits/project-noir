import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { settingsService } from "../../services/settingsService";

interface SettingsContextValue { settings: NoirSettings | null; updateSettings: (changes: Partial<NoirSettings>) => Promise<void> }
const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NoirSettings | null>(null);
  useEffect(() => { void settingsService.get().then(setSettings); }, []);
  const updateSettings = async (changes: Partial<NoirSettings>) => setSettings(await settingsService.update(changes));
  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
