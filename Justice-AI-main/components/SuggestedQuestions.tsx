import React from "react";
import { suggestedQuestions } from "../utils/questions"; // Adjust the path as needed

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

// Function to get a random subset of questions
const getRandomQuestions = (questions: string[], num: number) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

export default function SuggestedQuestions({
  onSelectQuestion,
}: SuggestedQuestionsProps) {
  // Get 4 random questions from the list
  const randomQuestions = getRandomQuestions(suggestedQuestions, 4);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white dark:bg-zinc-950">
      <div className="flex-1 max-w-lg mx-auto">
        <h2 className="gradient-subb text-xl font-bold text-center">
          Welcome to
        </h2>
        <h2 className="gradient-text text-3xl md:text-[2.5rem] font-bold italic pb-3 text-center">
          Justice Intelligence
        </h2>
        <p className="gradient-sub text-center mb-6 font-medium dark:text-white">
          Only ask me anything about law and justice
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {randomQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSelectQuestion(question)}
              className="bg-white dark:text-zinc-400 dark:bg-zinc-950 hover-gradient-bg p-4 rounded-2xl border border-zinc-300 dark:border-zinc-600 flex items-center space-x-2"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
