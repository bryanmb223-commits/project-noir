const STOP_WORDS = new Set(["a", "ao", "aos", "as", "como", "com", "da", "das", "de", "do", "dos", "e", "em", "eu", "isso", "me", "meu", "minha", "o", "os", "para", "por", "que", "se", "sobre", "um", "uma"]);
const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const CONCEPTS = [
  ["tela", "telas", "interface", "interfaces", "visual", "estilo"],
  ["sprite", "sprites", "expressao", "expressoes"],
  ["ollama", "modelo", "local"],
  ["tarefa", "tarefas", "task", "tasks", "pendencia", "pendencias"],
];
const aliases = new Map(CONCEPTS.flatMap(group => group.map(term => [term, group.filter(candidate => candidate !== term)])));
const terms = value => {
  const result = new Set(normalize(value).split(/[^a-z0-9]+/).filter(term => term.length > 2 && !STOP_WORDS.has(term)));
  for (const term of [...result]) for (const alias of aliases.get(term) ?? []) result.add(alias);
  return result;
};
const intent = (query, pattern) => pattern.test(normalize(query));
const INTENTS = {
  memories: /\b(memoria|memorias|lembra|lembrar|preferencia|preferencias)\b/,
  notes: /\b(nota|notas|anotei|anotado|salvei|salvo)\b/,
  tasks: /\b(tarefa|tarefas|pendencia|pendencias|falta|fazer|todo)\b/,
  projects: /\b(projeto|projetos)\b/,
};

function isSelfContainedQuery(query) {
  const value = normalize(query).trim();
  return /^(quanto (e|eh)|calcule|calcular|resolva)?\s*[\d\s.,()+\-*/%^×÷]+\??$/.test(value)
    || /^(traduza|corrija a frase|defina)\b/.test(value);
}

function rank(items, query, projectId, textOf, { limit, forced = false }) {
  const wanted = terms(query);
  return items.map(item => {
    const text = textOf(item);
    const available = terms(text);
    let matches = 0;
    for (const term of wanted) if (available.has(term)) matches += 1;
    const ratio = wanted.size ? matches / wanted.size : 0;
    const projectMatch = Boolean(projectId && item.projectId === projectId);
    const score = matches * 3 + ratio * 4 + (projectMatch && matches ? 2 : 0);
    return { item, text, score, matches, projectMatch };
  }).filter(entry => forced ? entry.matches > 0 || entry.projectMatch : entry.matches > 0 && entry.score >= 4)
    .sort((a, b) => b.score - a.score || String(b.item.updatedAt ?? "").localeCompare(String(a.item.updatedAt ?? "")))
    .slice(0, limit);
}

function reusableSources(messages, query) {
  if (/^\s*\/web\b/i.test(query)) return [];
  if (/\b(agora|atual|atuais|hoje|mais recente|ultima|ultimas|202[4-9])\b/.test(normalize(query))) return [];
  const wanted = terms(query);
  if (wanted.size < 2) return [];
  const unique = new Map();
  for (const message of [...messages].reverse()) {
    if (message.role !== "ai" || !Array.isArray(message.sources)) continue;
    for (const source of message.sources) {
      const available = terms(`${source?.title ?? ""} ${source?.snippet ?? ""} ${source?.url ?? ""}`);
      let matches = 0;
      for (const term of wanted) if (available.has(term)) matches += 1;
      if (matches >= Math.min(2, wanted.size)) unique.set(source.url, source);
    }
    if (unique.size >= 5) break;
  }
  return [...unique.values()].slice(0, 5);
}

export function buildAIContext(store, { conversationId, projectId, query }) {
  const conversation = store.list("conversations").find(item => item.id === conversationId);
  const effectiveProjectId = projectId || conversation?.projectId;
  const allMessages = store.list("messages").filter(item => item.conversationId === conversationId).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const history = allMessages.slice(-12).map(item => ({ role: item.role === "ai" ? "assistant" : "user", content: String(item.content).slice(0, 2200) }));
  const empty = isSelfContainedQuery(query);
  const manual = Object.fromEntries(Object.entries(INTENTS).map(([key, pattern]) => [key, intent(query, pattern)]));
  const project = effectiveProjectId ? store.list("projects").find(item => item.id === effectiveProjectId) : null;
  const projectRelevant = Boolean(project && (manual.projects || rank([project], query, null, item => `${item.name}: ${item.description || ""}`, { limit: 1 }).length));
  const memories = empty ? [] : rank(store.list("memories"), query, effectiveProjectId, x => `${x.category}: ${x.content}`, { limit: manual.memories ? 5 : 3, forced: manual.memories });
  const notes = empty ? [] : rank(store.list("notes"), query, effectiveProjectId, x => `${x.title}: ${x.content}`, { limit: manual.notes ? 5 : 2, forced: manual.notes });
  const tasks = empty ? [] : rank(store.list("tasks"), query, effectiveProjectId, x => `${x.title}: ${x.description || ""} (${x.completed ? "concluída" : "pendente"})`, { limit: manual.tasks ? 5 : 2, forced: manual.tasks });
  const sources = empty ? [] : reusableSources(allMessages, query);
  const sections = [];
  if (projectRelevant) sections.push(`PROJETO RELEVANTE:\n${project.name}: ${project.description || "sem descrição"}`);
  if (memories.length) sections.push(`MEMÓRIAS RELEVANTES:\n${memories.map(x => `- ${x.text}`).join("\n")}`);
  if (notes.length) sections.push(`NOTAS RELEVANTES:\n${notes.map(x => `- ${x.text}`).join("\n")}`);
  if (tasks.length) sections.push(`TAREFAS RELEVANTES:\n${tasks.map(x => `- ${x.text}`).join("\n")}`);
  const reusableWebContext = sources.length ? `FONTES WEB JÁ CONSULTADAS NESTA CONVERSA (reutilizadas sem nova busca):\n${sources.map((source, index) => `[${index + 1}] ${source.title}\nURL: ${source.url}\n${source.snippet || ""}`).join("\n\n")}` : "";
  return {
    history,
    context: sections.join("\n\n").slice(0, 12000),
    reusableWebContext: reusableWebContext.slice(0, 7000),
    reusedSources: sources,
    selection: { project: projectRelevant ? project?.id : null, memories: memories.map(x => x.item.id), notes: notes.map(x => x.item.id), tasks: tasks.map(x => x.item.id), manual, selfContained: empty },
  };
}
