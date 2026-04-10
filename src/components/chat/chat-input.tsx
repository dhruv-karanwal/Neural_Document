"use client";

import { useState } from "react";
import { Send, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  disabled: boolean;
  isThinking: boolean;
}

export function ChatInput({ onSend, onClear, disabled, isThinking }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled && !isThinking) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <div className="p-4 glass rounded-t-3xl border-t border-white/10 mt-auto">
      <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="rounded-full flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              disabled={disabled}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Chat History</TooltipContent>
        </Tooltip>

        <div className="relative flex-1 group">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            placeholder={disabled ? "Upload a document to start chatting..." : "Ask something about the document..."}
            className="w-full h-12 px-6 pr-12 rounded-full border-white/10 bg-white/5 focus:bg-white/10 focus-visible:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {!disabled && !value && (
               <Sparkles className="w-4 h-4 text-primary/40 animate-pulse" />
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={disabled || !value.trim() || isThinking}
          className="rounded-full w-12 h-12 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
      <p className="text-[10px] text-center mt-2 text-muted-foreground/40 font-medium tracking-widest uppercase">
        NeuralDoc AI Intelligence Engine
      </p>
    </div>
  );
}
