"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  isThinking: boolean;
}

export function ChatInterface({ messages, isThinking }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking]);

  return (
    <ScrollArea ref={scrollRef} className="h-full px-4">
      <div className="flex flex-col gap-6 py-8">
        {messages.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center h-[400px] text-center gap-4 opacity-40">
            <Brain className="w-12 h-12" />
            <div className="space-y-1">
              <p className="text-xl font-medium">Ready to assist</p>
              <p className="text-sm">Ask anything about the document above</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-4 w-full max-w-[90%]",
                message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",
                message.role === "user" 
                  ? "bg-secondary border-white/10" 
                  : "bg-primary/20 border-primary/20"
              )}>
                {message.role === "user" ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4 text-primary" />}
              </div>

              <div className="flex flex-col gap-2">
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "glass-card text-foreground rounded-tl-none border-white/5"
                )}>
                  {message.content}
                </div>
                
                {message.confidence !== undefined && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Badge variant="secondary" className="bg-secondary/50 text-[10px] uppercase tracking-wider py-0 px-1.5 h-4 font-bold border-white/5">
                      Confidence: {Math.round(message.confidence * 100)}%
                    </Badge>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 w-full mr-auto"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border bg-primary/20 border-primary/20">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-none border-white/5">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
