export class MockProvider {
  name = "mock";

  async generate({ messages }) {
    const lastMessage = messages.at(-1)?.content?.trim() || "sua solicitação";
    if (lastMessage.toLowerCase() === "/error") throw new Error("Erro simulado pelo MockProvider.");
    return {
      message: `Entendido. Recebi: “${lastMessage}”. O MockProvider está ativo enquanto nenhum provider real estiver configurado.`,
      emotion: "happy",
      provider: this.name,
    };
  }
}
