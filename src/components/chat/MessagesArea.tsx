
import { Message } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";

interface MessagesAreaProps {
  messages: Message[];
}

export const MessagesArea = ({ messages }: MessagesAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <ScrollArea className="h-[400px] p-4">
      <div className="space-y-4 pb-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
