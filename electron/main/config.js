export const GLOBAL_SHORTCUT = "CommandOrControl+Shift+Space";
export const ALLOWED_EMOTIONS = ["neutral", "happy", "confident", "thinking", "excited", "surprised", "embarrassed", "sad", "irritated", "concerned", "sleepy", "laughing", "flustered", "deadpan", "wink"];

export function inferEmotion(value) {
  const text = String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/erro|falha|nao funcion|frustr|irrit/.test(text)) return "irritated";
  if (/risco|cuidado|preocup|atencao/.test(text)) return "concerned";
  if (/surpresa|inesperad|uau/.test(text)) return "surprised";
  if (/haha|engrac|risad/.test(text)) return "laughing";
  if (/excelente|otimo|conseguimos|pronto!/.test(text)) return "happy";
  if (/vamos|posso fazer|proximo passo/.test(text)) return "confident";
  if (/analisando|considerando|talvez/.test(text)) return "thinking";
  return "neutral";
}
