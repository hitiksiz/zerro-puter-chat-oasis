
export interface ChatModel {
  value: string;
  label: string;
  emoji: string;
}

export const chatModels: ChatModel[] = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini", emoji: "🤖" },
  { value: "gpt-4o", label: "GPT-4o", emoji: "🧠" },
  { value: "o1", label: "O1", emoji: "🔮" },
  { value: "o1-mini", label: "O1 Mini", emoji: "✨" },
  { value: "o1-pro", label: "O1 Pro", emoji: "⚡" },
  { value: "o3", label: "O3", emoji: "🚀" },
  { value: "o3-mini", label: "O3 Mini", emoji: "💫" },
  { value: "o4-mini", label: "O4 Mini", emoji: "🌟" },
  { value: "gpt-4.1", label: "GPT-4.1", emoji: "🔍" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini", emoji: "📱" },
  { value: "gpt-4.1-nano", label: "GPT-4.1 Nano", emoji: "⚙️" },
  { value: "gpt-4.5-preview", label: "GPT-4.5 Preview", emoji: "🔱" },
  { value: "claude-3-7-sonnet", label: "Claude 3.7 Sonnet", emoji: "🎭" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", emoji: "🎼" },
  { value: "deepseek-chat", label: "DeepSeek Chat", emoji: "💬" },
  { value: "deepseek-reasoner", label: "DeepSeek Reasoner", emoji: "🧩" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", emoji: "💎" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", emoji: "💡" },
  { value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", label: "Llama 8B", emoji: "🦙" },
  { value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", label: "Llama 70B", emoji: "🦙" },
  { value: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", label: "Llama 405B", emoji: "🦙" },
  { value: "mistral-large-latest", label: "Mistral Large", emoji: "🌀" },
  { value: "pixtral-large-latest", label: "Pixtral Large", emoji: "🖌️" },
  { value: "codestral-latest", label: "Codestral", emoji: "👨‍💻" },
  { value: "google/gemma-2-27b-it", label: "Gemma", emoji: "🧪" },
  { value: "grok-beta", label: "Grok Beta", emoji: "🔬" },
];
