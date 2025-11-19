"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { DisclaimerModal } from "@/components/disclaimer-modal";

interface Message {
  role: "user" | "bot";
  content: string;
  sources?: any[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const xAPI = process.env.NEXT_PUBLIC_AUTH_API_KEY;

export default function ChatPage() {
  const router = useRouter();
  const { idToken, logout, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!idToken) {
      router.push("/");
    }
  }, [idToken, router]);

  useEffect(() => {
    const agreed = localStorage.getItem("disclaimer_agreed") === "true";
    setDisclaimerAgreed(agreed);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDisclaimerAgree = () => {
    setDisclaimerAgreed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("disclaimer_agreed");
    logout();
    router.push("/");
  };

  const handleSendMessage = async (userMessage: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setError(null);
    setMessages((prev) => [...prev, { role: "bot", content: "Thinking..." }]);
    setIsLoading(true);

    try {  
      if(!xAPI){
        throw new Error("Missing x-api-key, unknown source!");
      }

      const response = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "x-api-key": xAPI
        },
        body: JSON.stringify({ query: userMessage }),
      });

      setMessages((prev) => prev.slice(0, -1));

      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/");
        return;
      }

      if (response.status === 429) {
        setError("You are sending requests too quickly. Please wait a moment.");
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "Rate limited. Please wait before sending another message.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (response.status === 500) {
        setError("The server encountered an error. Please try again.");
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Server error. Please try again." },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: data.answer,
          sources: data.retrieved_context,
        },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!idToken) {
    return null;
  }

  if (!disclaimerAgreed) {
    return <DisclaimerModal onAgree={handleDisclaimerAgree} />;
  }

  return (
    <div className="flex flex-col h-screen manuscript-bg relative">
      {/* Enhanced Header with Primary Color Accents */}
      <header className="relative z-10 border-b border-border bg-card/95 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between p-4 md:px-6">
          {/* Left Section - Logo & Title with Primary Color */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xxl md:text-xl font-bold text-foreground">
                Project Vivek
              </h1>
            </div>
          </div>

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center gap-3">
            {/* User Info Card with Primary Color Avatar */}
            {user?.email && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button - Keep it subtle, not primary color */}
            <Button
              variant="outline"
              onClick={handleLogout}
              size="sm"
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide relative z-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md animate-in-up bg-card/90 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Welcome to project Vivek!
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Start by typing your question in the text box below
              </p>
              {/* Primary Color Accent Line */}
              <div className="w-16 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto rounded-full"></div>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            sources={message.sources}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-in-slide backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Input area with backdrop */}
      <div className="relative z-10 bg-card/95 backdrop-blur-sm border-t border-border">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
