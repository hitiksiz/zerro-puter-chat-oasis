
import { useState, useRef, useEffect } from "react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Message, ChatSession } from "@/types/chat";
import { ModelSelector } from "./chat/ModelSelector";
import { MessagesArea } from "./chat/MessagesArea";
import { ChatInput } from "./chat/ChatInput";
import { ChatHistory } from "./chat/ChatHistory";
import { SystemPromptSettings } from "./chat/SystemPromptSettings";
import { sendChatMessage } from "@/services/chatService";
import { 
  createNewChatSession, 
  saveChatSession,
  generateAdaptiveSystemPrompt
} from "@/services/chatHistoryService";
import { Plus } from "lucide-react";

export const Chat = () => {
  const [currentSession, setCurrentSession] = useState<ChatSession>(createNewChatSession());
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Save current session whenever messages change
  useEffect(() => {
    if (currentSession.messages.length > 0) {
      saveChatSession({
        ...currentSession,
        lastUpdated: new Date()
      });
    }
  }, [currentSession.messages]);
  
  // Generate title for new chats based on first message
  useEffect(() => {
    const messages = currentSession.messages;
    // Generate title from first user message if this is a new chat with only one message
    if (messages.length === 1 && messages[0].sender === "user" && currentSession.title.startsWith("Chat")) {
      const content = messages[0].content;
      const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
      setCurrentSession(prev => ({
        ...prev,
        title
      }));
    }
  }, [currentSession.messages]);
  
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    try {
      const userMessage = {
        sender: "user" as const,
        content: inputValue,
        timestamp: new Date(),
      };
      
      // Update messages with user message
      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        lastUpdated: new Date()
      }));
      
      setInputValue("");
      setIsProcessing(true);
      
      // Generate adaptive system prompt based on conversation history
      const adaptivePrompt = currentSession.messages.length >= 3
        ? generateAdaptiveSystemPrompt([...currentSession.messages, userMessage])
        : currentSession.systemPrompt;
      
      const aiResponse = await sendChatMessage(inputValue, selectedModel, adaptivePrompt);
      
      if (aiResponse) {
        setCurrentSession(prev => ({
          ...prev,
          messages: [...prev.messages, aiResponse],
          systemPrompt: adaptivePrompt, // Update with adaptive prompt
          lastUpdated: new Date()
        }));
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
  
  const handleNewChat = () => {
    setCurrentSession(createNewChatSession());
    toast.info("Started a new chat");
  };
  
  const handleSelectSession = (session: ChatSession) => {
    // Convert date strings back to Date objects
    const fixedSession = {
      ...session,
      lastUpdated: new Date(session.lastUpdated),
      messages: session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
    setCurrentSession(fixedSession);
  };
  
  const handleUpdateSystemPrompt = (newPrompt: string) => {
    setCurrentSession(prev => ({
      ...prev,
      systemPrompt: newPrompt
    }));
    toast.success("System prompt updated");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <CardHeader className="px-4 py-3 border-b border-border/30 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
        </div>
        <div className="flex items-center gap-1">
          <ChatHistory onSelectSession={handleSelectSession} />
          <SystemPromptSettings 
            systemPrompt={currentSession.systemPrompt} 
            onUpdateSystemPrompt={handleUpdateSystemPrompt} 
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewChat}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </Button>
        </div>
      </CardHeader>
      
      <MessagesArea messages={currentSession.messages} />
      
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
