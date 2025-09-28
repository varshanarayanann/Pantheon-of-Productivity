import React, { useState, useRef, useEffect } from "react";
import type { ChatMessage, CalendarEvent, Task } from "../../types";
import { sendMessage } from "./services/apiService";

const BotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-purple-400 dark:text-purple-300"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M8.5 12.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" />
    <path d="M12 7c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z" opacity=".3" />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-indigo-400 dark:text-indigo-300"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

interface ChatbotProps {
  onAddEvent: (eventData: Omit<CalendarEvent, "id">) => void;
  onAddTask: (taskData: Omit<Task, "id" | "completed">) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onAddEvent, onAddTask }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I'm Hera. I can schedule events and track tasks. Try saying: 'Add a task to finish my report by Friday'.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
    };
    const historyForApi = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(userInput, historyForApi);

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const fc of functionCalls) {
          if (fc.name === "addCalendarEvent") {
            const { title, startTime, endTime, description } = fc.args;
            const start = new Date(startTime as string);
            const end = endTime
              ? new Date(endTime as string)
              : new Date(start.getTime() + 60 * 60 * 1000);

            if (typeof title === "string" && !isNaN(start.getTime())) {
              onAddEvent({
                title,
                start,
                end,
                description: description as string | undefined,
              });
              const botMessage: ChatMessage = {
                id: Date.now().toString() + "b",
                sender: "bot",
                text: `OK, I've added "${title}" to your calendar.`,
              };
              setMessages((prev) => [...prev, botMessage]);
            } else {
              throw new Error("Invalid event data from AI.");
            }
          }
          if (fc.name === "addTask") {
            const { title, type, dueDate } = fc.args;
            if (
              typeof title === "string" &&
              (type === "assignment" || type === "habit")
            ) {
              onAddTask({
                title: title as string,
                type: type as "assignment" | "habit",
                dueDate: dueDate as string | undefined,
              });
              const botMessage: ChatMessage = {
                id: Date.now().toString() + "b",
                sender: "bot",
                text: `Got it. I've added "${title}" to your tasks.`,
              };
              setMessages((prev) => [...prev, botMessage]);
            } else {
              throw new Error("Invalid task data from AI.");
            }
          }
        }
      } else if (response.text) {
        const botMessage: ChatMessage = {
          id: Date.now().toString() + "b",
          sender: "bot",
          text: response.text,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "err",
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-transparent">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : ""
              }`}
            >
              {msg.sender === "bot" && (
                <div className="flex-shrink-0">
                  <BotIcon />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-indigo-100 dark:bg-indigo-500 text-gray-700 dark:text-indigo-50 rounded-br-lg"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-bl-lg"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0">
                  <UserIcon />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <BotIcon />
              </div>
              <div className="max-w-xs md:max-w-md px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-purple-200 dark:bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-purple-200 dark:bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-purple-200 dark:bg-purple-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Hera..."
            className="flex-grow bg-gray-100 dark:bg-slate-700 dark:text-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-300 dark:bg-indigo-500 rounded-full p-2 text-gray-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-indigo-400 disabled:bg-gray-200 dark:disabled:bg-slate-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;