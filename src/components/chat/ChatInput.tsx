
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { ForwardedRef, forwardRef, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export const ChatInput = forwardRef(
  ({ value, onChange, onSend, onKeyDown, isProcessing }: ChatInputProps, 
    ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="border-t border-border/30 p-4 flex gap-2">
        <Input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          disabled={isProcessing}
          className="flex-1"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
