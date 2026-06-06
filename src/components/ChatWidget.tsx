'use client';

import { useChat } from 'ai/react';

export default function ChatWidget({ businessId }: { businessId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { businessId },
  });

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b bg-blue-600 text-white font-semibold rounded-t-lg">
        AI Receptionist
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            How can we help you today?
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 shadow-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-500 animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50 rounded-b-lg">
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          value={input}
          placeholder="Ask a question or book an appointment..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
