import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, CheckCircle, RefreshCw } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {message.sender === "ai" && (
        <img
          src="/ai-avatar.png"
          alt="AI Avatar"
          className="w-10 h-10 rounded-full mr-2 dark:shadow-lg"
        />
      )}
      <div className="max-w-[80%] relative">
        <div
          className={`p-3 rounded-lg ${
            message.sender === "user"
              ? "ms-bg text-white rounded-2xl"
              : "bg-zinc-50 text-zinc-800 border-[1px] mb-8 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
          }`}
        >
          {message.sender === "ai" ? (
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-semibold mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-medium mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-md font-medium mb-1" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
          {/* Action Buttons at the bottom-right inside the message container */}
          {message.sender === "ai" && (
            <div className="absolute bottom right-2 flex space-x-2 bg-white dark:bg-zinc-950 p-2 rounded-xl border-[1px] border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleCopy}
                className="flex items-center text-sm text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-200"
                title={copied ? "Copied!" : "Copy message"}
              >
                {copied ? (
                  <>
                    <CheckCircle size={14} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center text-sm text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-200"
                  title="Regenerate response"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {message.sender === "user" && (
        <img
          src="/user-avatar.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full ml-2 dark:shadow-lg"
        />
      )}
    </div>
  );
};

export default ChatMessage;
