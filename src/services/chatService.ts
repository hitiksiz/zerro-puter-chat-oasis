
import { Message } from "@/types/chat";
import { toast } from "sonner";
import { detectEmotions, getEmotionResponse } from "@/utils/emotionDetector";

declare global {
  interface Window {
    puter: any;
  }
}

export const sendChatMessage = async (
  message: string, 
  model: string,
  systemPrompt: string = ""
): Promise<Message | null> => {
  const startTime = performance.now();
  const emotions = detectEmotions(message);
  
  try {
    // Check auth first
    if (!window.puter || !(await window.puter.auth.isSignedIn())) {
      toast.error("Please sign in to chat! 🔑");
      return null;
    }
    
    // Prepare the chat options
    const chatOptions: any = { 
      model: model,
      stream: false
    };
    
    // Add system prompt if provided
    if (systemPrompt) {
      chatOptions.systemPrompt = systemPrompt;
    }
    
    const response = await window.puter.ai.chat(message, chatOptions);
    
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
    
    // Add emotion response if emotions were detected
    const emotionResponse = getEmotionResponse(emotions);
    if (emotionResponse) {
      responseContent = `${emotionResponse}\n\n${responseContent}`;
    }
    
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    return {
      sender: "ai" as const,
      content: responseContent,
      timestamp: new Date(),
      responseTime,
      emotions
    };
  } catch (error) {
    console.error("AI chat error:", error);
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    toast.error("Something went wrong with the AI response.");
    
    return {
      sender: "system" as const,
      content: `⚠️ Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
      timestamp: new Date(),
      responseTime
    };
  }
};
