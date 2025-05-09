
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
      stream: false // Changed to false to get complete response at once
    });
    
    // Debug the response structure
    console.log("AI response:", response);
    
    // Extract content directly from the response if it exists
    let responseContent = "";
    
    if (response && typeof response === 'object') {
      // Handle different response structures
      if (response.message && response.message.content) {
        responseContent = response.message.content;
      } else if (response.content) {
        responseContent = response.content;
      } else if (typeof response === 'string') {
        responseContent = response;
      }
    }
    
    // Fallback message if we couldn't extract content
    if (!responseContent) {
      responseContent = "Sorry, I couldn't process that request. Please try again.";
    }
    
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
