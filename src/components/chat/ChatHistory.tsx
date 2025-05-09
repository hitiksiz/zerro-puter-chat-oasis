
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChatSession } from "@/types/chat";
import { getChatSessions, deleteChatSession } from "@/services/chatHistoryService";
import { History, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatHistoryProps {
  onSelectSession: (session: ChatSession) => void;
}

export const ChatHistory = ({ onSelectSession }: ChatHistoryProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (open) {
      setSessions(getChatSessions());
    }
  }, [open]);
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteChatSession(id);
    setSessions(getChatSessions());
  };
  
  const handleSelectSession = (session: ChatSession) => {
    onSelectSession(session);
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <History className="h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[500px] pr-4 mt-4">
          {sessions.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No chat history found
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="border border-border/50 rounded-md p-3 hover:bg-accent/50 cursor-pointer transition-colors flex justify-between items-center"
                  onClick={() => handleSelectSession(session)}
                >
                  <div>
                    <div className="font-medium truncate max-w-[200px]">
                      {session.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(session.lastUpdated), { addSuffix: true })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {session.messages.length} messages
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-50 hover:opacity-100"
                    onClick={(e) => handleDelete(e, session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
