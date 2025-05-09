
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  sender: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}

const models = [
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    try {
      // Check auth first
      if (!window.puter || !(await window.puter.auth.isSignedIn())) {
        toast.error("Please sign in to chat! 🔑");
        return;
      }
      
      const userMessage = {
        sender: "user" as const,
        content: inputValue,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsProcessing(true);
      
      // Get selected emoji for the model
      const modelInfo = models.find(m => m.value === selectedModel) || models[0];
      
      try {
        const response = await window.puter.ai.chat(inputValue, { 
          model: selectedModel,
          stream: true 
        });
        
        const aiMessage = {
          sender: "ai" as const,
          content: response.message.content,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("AI chat error:", error);
        
        const errorMessage = {
          sender: "system" as const,
          content: `⚠️ Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        toast.error("Something went wrong with the AI response.");
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
      <div className="border-b border-border/30">
        <div className="p-4 flex flex-wrap gap-3 items-center">
          <div className="flex-1">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <span className="flex items-center gap-2">
                      <span>{model.emoji}</span>
                      <span>{model.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {models.find(m => m.value === selectedModel)?.emoji || "🤖"} {models.find(m => m.value === selectedModel)?.label || "AI Model"}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender !== "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    {message.sender === "ai" ? "AI" : "🔔"}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.sender === "ai"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground text-sm"
                )}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {message.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    {message.sender.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="border-t border-border/30 p-4 gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isProcessing}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </>
  );
};
