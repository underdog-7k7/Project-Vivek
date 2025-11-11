"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, BookOpen, Hash } from "lucide-react"

interface Source {
  shloka_text: string
  chapter_id: string
  shloka_number: string
  full_chapter_context: string
  retrieval_distance: number
}

interface SourcesAccordionProps {
  sources: Source[]
}

export function SourcesAccordion({ sources }: SourcesAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSource, setExpandedSource] = useState<number | null>(null)

  if (!sources || sources.length === 0) return null

  const toggleSource = (index: number) => {
    setExpandedSource(expandedSource === index ? null : index)
  }

  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden bg-card/50">
      {/* Main Sources Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">
            Sources ({sources.length})
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Sources List */}
      {isOpen && (
        <div className="border-t border-border bg-card">
          {sources.map((source, index) => (
            <div
              key={index}
              className="border-b border-border last:border-b-0"
            >
              {/* Individual Source Header */}
              <div className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Chapter and Shloka Info */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        <Hash className="w-3 h-3" />
                        {source.chapter_id.replace("ch_", "Chapter ")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Shloka {source.shloka_number}
                      </span>
                    </div>

                    {/* Shloka Text */}
                    <blockquote className="border-l-2 border-primary/30 pl-3 py-1 italic text-sm text-foreground/90">
                      "{source.shloka_text}"
                    </blockquote>

                    {/* Expand Full Context Button */}
                    <button
                      onClick={() => toggleSource(index)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {expandedSource === index ? (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          Hide full context
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-3.5 h-3.5" />
                          Read full chapter context
                        </>
                      )}
                    </button>

                    {/* Full Chapter Context (Expandable) */}
                    {expandedSource === index && (
                      <div className="mt-3 p-3 rounded-md bg-muted/50 border border-border">
                        <p className="text-xs font-semibold text-foreground/70 mb-2 uppercase tracking-wide">
                          Full Chapter Context
                        </p>
                        <div className="text-sm text-foreground/80 leading-relaxed max-h-64 overflow-y-auto prose prose-sm">
                          {source.full_chapter_context}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
