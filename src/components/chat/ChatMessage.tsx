
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
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
  );
};
