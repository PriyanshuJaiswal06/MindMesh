'use client';
// app/dashboard/ask/page.jsx

import { useState, useRef, useEffect } from 'react';
import { askMindMesh } from '../../../lib/api';

const WELCOME = {
  role: 'assistant',
  content: 'Hi! Ask me anything about your saved articles and PDFs. I\'ll answer using only your personal knowledge base — not the internet.',
  sources: [],
};

export default function AskPage() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);

    try {
      const data = await askMindMesh(q);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        sources: data.sources || [],
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Something went wrong: ${err.message}`,
        sources: [],
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 64px)', maxWidth: '880px', margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1A2818', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Ask AI
          </h1>
          <p style={{ fontSize: '13.5px', color: '#6A8068', margin: 0 }}>
            Answers come only from your saved content.
          </p>
        </div>
        <button
          onClick={() => setMessages([WELCOME])}
          style={{
            padding: '7px 14px', fontSize: '13px', fontWeight: '500',
            background: 'transparent', color: '#7A9870',
            border: '1px solid #D0DCC8', borderRadius: '8px',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EDF2EB'; e.currentTarget.style.color = '#2A4828'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A9870'; }}
        >
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        gap: '16px', marginBottom: '16px', paddingRight: '4px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '8px' }}>

              {/* Bubble */}
              <div style={{
                padding: '12px 16px', borderRadius: '12px', fontSize: '14px',
                lineHeight: '1.6', whiteSpace: 'pre-wrap',
                background: msg.role === 'user' ? '#3B6D11' : 'rgba(237,242,235,0.8)',
                color: msg.role === 'user' ? '#EAF3DE' : '#1A2818',
                border: msg.role === 'user' ? 'none' : '1px solid #D0DCC8',
                boxShadow: msg.role === 'user' ? '0 2px 6px rgba(59,109,17,0.2)' : 'none',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              }}>
                {msg.content}
              </div>

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#9AB098', margin: 0, paddingLeft: '4px' }}>
                    Sources from your knowledge base:
                  </p>
                  {msg.sources.map((src, j) => (
                    <a
                      key={j}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '12px', color: '#3B6D11', textDecoration: 'none',
                        background: '#EAF3DE', border: '1px solid #C0D8A8',
                        borderRadius: '6px', padding: '6px 10px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#D8ECC8'}
                      onMouseLeave={e => e.currentTarget.style.background = '#EAF3DE'}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {src.title || src.url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: 'rgba(237,242,235,0.8)', border: '1px solid #D0DCC8',
              borderRadius: '12px 12px 12px 2px', padding: '14px 18px',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              {[0, 150, 300].map(delay => (
                <div key={delay} style={{
                  width: '7px', height: '7px', borderRadius: '50%', background: '#7A9870',
                  animation: 'bounce 1.2s infinite',
                  animationDelay: `${delay}ms`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: '10px', background: '#FFFFFF',
          border: '1px solid #C0CEB8', borderRadius: '12px', padding: '8px 8px 8px 16px',
          boxShadow: '0 2px 8px rgba(42,72,40,0.06)', transition: 'border-color 0.15s',
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = '#3B6D11'}
          onBlurCapture={e => e.currentTarget.style.borderColor = '#C0CEB8'}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your saved content..."
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '14px', color: '#1A2818', resize: 'none', lineHeight: '1.5',
              padding: '6px 0', fontFamily: 'inherit', maxHeight: '120px',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '8px 18px', fontSize: '13.5px', fontWeight: '500',
              background: (loading || !input.trim()) ? '#C0CEB8' : '#3B6D11',
              color: '#EAF3DE', border: 'none', borderRadius: '8px',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s', alignSelf: 'flex-end',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = '#2A5008'; }}
            onMouseLeave={e => { if (!loading && input.trim()) e.currentTarget.style.background = '#3B6D11'; }}
          >
            Send
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#B0C0A8', margin: '8px 0 0' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
