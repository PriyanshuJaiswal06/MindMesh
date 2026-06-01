'use client';
// app/dashboard/ask/page.jsx
// AI Q&A — Ask questions, get answers from your saved content (RAG)

import { useState, useRef, useEffect } from 'react';
import { askMindMesh } from '../../../lib/api';

function Message({ msg }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-600/50 flex items-center justify-center text-sm shrink-0 mt-0.5">
          ✦
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-sm'
            : 'bg-gray-900 border border-gray-800 text-gray-100 rounded-bl-sm'
        }`}>
          {msg.content}
        </div>

        {/* Sources */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-col gap-1.5 w-full">
            <p className="text-xs text-gray-500 pl-1">Sources from your knowledge base:</p>
            {msg.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gray-900 border border-gray-800 hover:border-purple-600/40 text-purple-400 hover:text-purple-300 px-3 py-2 rounded-lg transition truncate"
              >
                ↗ {source.title || source.url}
              </a>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm shrink-0 mt-0.5">
          ◉
        </div>
      )}
    </div>
  );
}

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `Hi! I'm MindMesh AI.\n\nAsk me anything about your saved articles and I'll answer using only your personal knowledge base — not the general internet.\n\nExample: "What did I save about machine learning?"`,
  sources: [],
};

export default function AskPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);

    try {
      const data = await askMindMesh(q);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Something went wrong: ${err.message}`,
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    // Submit on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function clearChat() {
    setMessages([WELCOME_MESSAGE]);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Ask AI</h2>
          <p className="text-gray-400 text-sm mt-0.5">Answers come only from your saved content.</p>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg transition"
        >
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-4">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-600/50 flex items-center justify-center text-sm shrink-0">
              ✦
            </div>
            <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0">
        <div className="flex gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-2 focus-within:border-purple-500/50 transition">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your saved content..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm px-2 py-2 focus:outline-none resize-none leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition self-end text-sm font-medium shrink-0"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </form>
    </div>
  );
}
