
import { Message } from "@/types/chat";
import { toast } from "sonner";

declare global {
  interface Window {
    puter: any;
  }
}

export const sendChatMessage = async (
  message: string, 
  model: string
): Promise<Message | null> => {
  try {
    // Check auth first
    if (!window.puter || !(await window.puter.auth.isSignedIn())) {
      toast.error("Please sign in to chat! 🔑");
      return null;
    }
    
    const response = await window.puter.ai.chat(message, { 
      model: model,
      stream: true 
    });
    
    // Check if response and response.message exist before accessing content
    const responseContent = response?.message?.content || "Sorry, I couldn't generate a response.";
    
    return {
      sender: "ai" as const,
      content: responseContent,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("AI chat error:", error);
    
    toast.error("Something went wrong with the AI response.");
    
    return {
      sender: "system" as const,
      content: `⚠️ Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
      timestamp: new Date(),
    };
  }
};
