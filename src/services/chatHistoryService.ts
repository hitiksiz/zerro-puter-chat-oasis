
import { Message, ChatSession } from "@/types/chat";

const STORAGE_KEY = "puter_chat_history";
const DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant. Be friendly, concise, and accurate.";

export const getChatSessions = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return [];
  }
};

export const saveChatSession = (session: ChatSession): void => {
  try {
    const sessions = getChatSessions();
    const existingSessionIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingSessionIndex >= 0) {
      sessions[existingSessionIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save chat session:", error);
  }
};

export const deleteChatSession = (id: string): void => {
  try {
    const sessions = getChatSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to delete chat session:", error);
  }
};

export const createNewChatSession = (): ChatSession => {
  return {
    id: crypto.randomUUID(),
    title: `Chat ${new Date().toLocaleString()}`,
    messages: [],
    lastUpdated: new Date(),
    systemPrompt: DEFAULT_SYSTEM_PROMPT
  };
};

// Adaptive system prompt generator based on user interactions
export const generateAdaptiveSystemPrompt = (messages: Message[]): string => {
  // Start with the default prompt
  let adaptivePrompt = DEFAULT_SYSTEM_PROMPT;
  
  // Only analyze if we have enough user messages
  const userMessages = messages.filter(m => m.sender === "user");
  if (userMessages.length >= 3) {
    // Extract topics from user messages
    const combinedContent = userMessages.map(m => m.content).join(" ");
    const topics = extractTopics(combinedContent);
    
    // Extract emotions
    const emotions = extractEmotions(userMessages);
    
    // Enhance the system prompt based on detected patterns
    if (topics.length > 0) {
      adaptivePrompt += ` Focus on ${topics.join(", ")} as the user has shown interest in these topics.`;
    }
    
    if (emotions.length > 0) {
      adaptivePrompt += ` The user tends to express ${emotions.join(", ")} emotions, so respond accordingly.`;
    }
    
    // Add conversation style adaptation
    if (averageMessageLength(userMessages) < 50) {
      adaptivePrompt += " The user prefers concise responses.";
    } else {
      adaptivePrompt += " The user seems to appreciate detailed responses.";
    }
  }
  
  return adaptivePrompt;
};

// Helper functions for adaptive prompt generation
function extractTopics(text: string): string[] {
  // Simplified topic extraction based on frequency of non-stop words
  const stopWords = ["the", "and", "a", "an", "in", "on", "at", "for", "to", "of", "is", "are"];
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.includes(word) && word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
}

function extractEmotions(messages: Message[]): string[] {
  const allEmotions: string[] = [];
  messages.forEach(message => {
    if (message.emotions) {
      message.emotions.forEach(emotion => {
        if (!allEmotions.includes(emotion)) {
          allEmotions.push(emotion);
        }
      });
    }
  });
  return allEmotions.slice(0, 3); // Return top 3 emotions
}

function averageMessageLength(messages: Message[]): number {
  if (messages.length === 0) return 0;
  const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
  return totalLength / messages.length;
}
