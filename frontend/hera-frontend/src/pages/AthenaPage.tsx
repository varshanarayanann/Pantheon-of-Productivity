// src/pages/AthenaPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout.js';
import { GODDESSES } from '../../../../constants.js';

const AthenaPage: React.FC = () => {
  const athena = GODDESSES.find(g => g.id === 'athena')!;
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: "Greetings, seeker of knowledge. I am Athena. What wisdom do you wish to unravel today? Ask, and let us begin our intellectual journey."
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send user input to your backend
      const res = await fetch('http://localhost:5001/api/athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!res.ok) {
        throw new Error('Failed to connect to Athena');
      }

      const data = await res.json();
      const modelMessage = { role: 'model' as const, text: data.text ?? '' };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error(err);
      setError(`An error occurred: ${err.message}`);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: 'My apologies, a momentary disruption in the cosmos has occurred. Please check your connection and try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoddessPageLayout goddess={athena}>
      {error && (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200 mb-4">
          <p className="font-semibold">Could not connect with the Goddess of Wisdom.</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="flex flex-col h-[60vh] max-w-4xl mx-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        <div
          ref={chatContainerRef}
          className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 rounded-t-lg space-y-4"
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md lg:max-w-xl px-4 py-2 rounded-xl shadow ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
                aria-label={msg.role === 'user' ? 'Your message' : "Athena's message"}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="flex items-center p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-lg"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask for guidance..."
            className="flex-grow px-4 py-2 text-slate-700 bg-slate-100 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition"
            disabled={isLoading}
            aria-label="Your message"
            aria-describedby="send-button"
          />
          <button
            id="send-button"
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="ml-4 flex-shrink-0 p-3 bg-indigo-500 dark:bg-indigo-600 text-white rounded-full hover:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </GoddessPageLayout>
  );
};

export default AthenaPage;
