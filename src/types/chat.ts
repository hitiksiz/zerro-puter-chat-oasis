
export interface Message {
  sender: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
  responseTime?: number; // Time taken to generate response in ms
  emotions?: string[]; // Detected emotions from user messages
}

// For local storage of chat sessions
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  systemPrompt: string;
}
