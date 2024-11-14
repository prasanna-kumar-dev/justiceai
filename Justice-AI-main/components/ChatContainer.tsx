"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import SkeletonLoading from "./SkeletonLoading";
import SuggestedQuestions from "./SuggestedQuestions";
import { ArrowDown } from "lucide-react"; // Import Lucide ArrowDown icon

export interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if scrolled up
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsScrolledUp(false); // Reset scroll up state when scrolling to bottom
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    await getAIResponse(input);
  };

  const getAIResponse = async (input: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/justice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const aiMessageText = data.response;
      const aiMessage: Message = { id: Date.now(), text: "", sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);

      const typingSpeed = 10;
      for (let i = 0; i <= aiMessageText.length; i++) {
        setTimeout(() => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, text: aiMessageText.slice(0, i) },
            ];
          });
        }, i * typingSpeed);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now(),
        text: "An error occurred. Please try again.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.sender === "user");
    if (lastUserMessage) {
      const messagesToKeep = messages.slice(0, -1);
      setMessages(messagesToKeep);
      await getAIResponse(lastUserMessage.text);
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 1; // Tolerance of 1px
      setIsScrolledUp(!isAtBottom);
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white dark:bg-zinc-950 mb-24 overflow-hidden"
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      {messages.length === 0 ? (
        <SuggestedQuestions onSelectQuestion={handleSendMessage} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onRegenerate={
                message.sender === "ai" ? handleRegenerate : undefined
              }
            />
          ))}
          {loading && <SkeletonLoading />}
          <div ref={messagesEndRef} />
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      {isScrolledUp && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-16 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowDown size={24} color="currentColor" />
        </button>
      )}
    </div>
  );
}
