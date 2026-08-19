import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CharacterState } from "./noirSprites";

interface CharacterContextValue {
  characterState: CharacterState;
  setCharacterState: (state: CharacterState) => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characterState, setState] = useState<CharacterState>("neutral");
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setCharacterState = useCallback((state: CharacterState) => {
    setState(state);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (state !== "neutral" && state !== "thinking") {
      idleTimer.current = setTimeout(() => setState("neutral"), 4500);
    }
  }, []);

  useEffect(() => () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  return (
    <CharacterContext.Provider value={{ characterState, setCharacterState }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) throw new Error("useCharacter must be used inside CharacterProvider");
  return context;
}
