export class MockProvider {
  name = "mock";
  async stream({ messages }, { signal, onDelta }) {
    const last = messages.at(-1)?.content?.trim() || "sua solicitação";
    if (last.toLowerCase() === "/error") throw new Error("Erro simulado pelo MockProvider.");
    const message = `Entendido. Recebi: “${last}”. Esta é uma resposta local do MockProvider.`;
    for (const chunk of message.match(/.{1,18}/g) ?? []) { if (signal?.aborted) throw new DOMException("Geração interrompida.", "AbortError"); onDelta(chunk); await new Promise(resolve => setTimeout(resolve, 20)); }
    return { message, emotion: "happy", provider: this.name, model: "local-mock" };
  }
}
