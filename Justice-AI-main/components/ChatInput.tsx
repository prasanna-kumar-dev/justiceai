import React from "react";
import { ArrowUp } from "lucide-react"; // Import the ArrowRight icon from lucide-react

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading }) => {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  // Determine button class based on input value and loading state
  const buttonClass = `text-zinc-500 rounded-full p-2 ${
    loading
      ? "bg-green-200 dark:bg-green-400 text-green-900" // thinking mode color
      : input.trim()
      ? "gradient-bg" // active state color
      : "bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-600" // default color
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-950 dark:border-zinc-800"
    >
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full pr-2 pl-6 py-2 mx-2 sm:mx-auto max-w-screen-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a query..."
          className="flex-grow bg-transparent pr-6 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none"
          disabled={loading}
        />
        <button type="submit" className={buttonClass} disabled={loading}>
          {loading ? (
            <span className="m-2">Thinking...</span>
          ) : (
            <ArrowUp
              size={20} // Set the size of the icon
              className="text-zinc-950 dark:text-zinc-50" // Apply text color for the icon
            />
          )}
        </button>
      </div>

      <div className="text-center text-xs text-zinc-500 py-2 dark:text-zinc-400">
        Don’t share sensitive information.
      </div>
    </form>
  );
};

export default ChatInput;
