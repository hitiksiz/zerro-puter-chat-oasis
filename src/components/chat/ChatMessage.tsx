
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  // Helper function to render emotion badges
  const renderEmotionBadges = () => {
    if (!message.emotions || message.emotions.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {message.emotions.map((emotion, index) => (
          <span 
            key={index} 
            className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {emotion}
          </span>
        ))}
      </div>
    );
  };
  
  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-fade-in",
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
        
        {message.sender === "user" && renderEmotionBadges()}
        
        <div className="text-xs opacity-70 mt-1 text-right flex items-center justify-end gap-1">
          {message.responseTime && message.sender === "ai" && (
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {message.responseTime}ms
            </span>
          )}
          <span>{message.timestamp.toLocaleTimeString()}</span>
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
  );
};
