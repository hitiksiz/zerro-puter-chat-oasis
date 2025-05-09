
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChatModel, chatModels } from "@/data/chatModels";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (value: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const currentModel = chatModels.find(m => m.value === selectedModel) || chatModels[0];
  
  return (
    <div className="border-b border-border/30">
      <div className="p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1">
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {chatModels.map((model) => (
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
          {currentModel.emoji} {currentModel.label}
        </Badge>
      </div>
    </div>
  );
};
