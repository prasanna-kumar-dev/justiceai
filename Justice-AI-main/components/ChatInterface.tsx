"use client";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
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

      const typingSpeed = 10; // Adjust this to speed up or slow down the typing effect
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

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a justice-related question..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
