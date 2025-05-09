
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { BookUser } from "lucide-react";

interface SystemPromptSettingsProps {
  systemPrompt: string;
  onUpdateSystemPrompt: (prompt: string) => void;
}

export const SystemPromptSettings = ({ 
  systemPrompt, 
  onUpdateSystemPrompt 
}: SystemPromptSettingsProps) => {
  const [open, setOpen] = useState(false);
  const [promptText, setPromptText] = useState(systemPrompt);
  
  const handleSave = () => {
    onUpdateSystemPrompt(promptText);
    setOpen(false);
  };
  
  const defaultPrompts = [
    {
      name: "Helpful Assistant",
      prompt: "You are a helpful AI assistant. Be friendly, concise, and accurate."
    },
    {
      name: "Code Teacher",
      prompt: "You are an expert programming teacher. Explain concepts clearly, provide code examples, and be patient."
    },
    {
      name: "Creative Writer",
      prompt: "You are a creative storyteller. Create engaging narratives, rich descriptions, and compelling characters."
    },
    {
      name: "Academic Advisor",
      prompt: "You are a knowledgeable academic advisor. Provide scholarly information, cite sources when possible, and maintain a formal tone."
    }
  ];
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <BookUser className="h-4 w-4" />
          System Prompt
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Customize System Prompt</SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            The system prompt helps define how the AI responds to your messages.
          </p>
          
          <Textarea 
            value={promptText} 
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-[200px]"
            placeholder="Enter a system prompt..."
          />
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Quick Templates</p>
          <div className="space-y-2">
            {defaultPrompts.map((preset, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => setPromptText(preset.prompt)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
        
        <SheetFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
