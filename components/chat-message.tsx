"use client"

import { Bot, User } from "lucide-react"
import { SourcesAccordion } from "./sources-accordion"

interface ChatMessageProps {
  role: "user" | "bot"
  content: string
  sources?: any[] // Add sources prop
}

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isBot = role === "bot"

  return (
    <div
      className={`flex gap-3 ${
        isBot ? "justify-start" : "justify-end"
      } animate-in-slide`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isBot
            ? "bg-card border border-border"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        
        {/* Add Sources Accordion for bot messages */}
        {isBot && sources && sources.length > 0 && (
          <SourcesAccordion sources={sources} />
        )}
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}
