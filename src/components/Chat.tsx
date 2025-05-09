
import { useState, useRef } from "react";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import { ModelSelector } from "./chat/ModelSelector";
import { MessagesArea } from "./chat/MessagesArea";
import { ChatInput } from "./chat/ChatInput";
import { sendChatMessage } from "@/services/chatService";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "system",
      content: "Welcome to Zerro's Chat Oasis! Sign in to start chatting with AI models. 👋",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    try {
      const userMessage = {
        sender: "user" as const,
        content: inputValue,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsProcessing(true);
      
      const aiResponse = await sendChatMessage(inputValue, selectedModel);
      if (aiResponse) {
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <ModelSelector 
        selectedModel={selectedModel} 
        onModelChange={setSelectedModel} 
      />
      
      <MessagesArea messages={messages} />
      
      <CardFooter className="p-0">
        <ChatInput
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isProcessing={isProcessing}
        />
      </CardFooter>
    </>
  );
};
