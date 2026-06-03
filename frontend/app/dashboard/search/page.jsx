'use client';
// app/dashboard/search/page.jsx

import { useState, useCallback } from 'react';
import { searchArticles } from '../../../lib/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setSearching(true);
    setError('');
    try {
      const data = await searchArticles(q);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce — fires 500ms after user stops typing
  const debouncedSearch = useCallback((() => {
    let timer;
    return (q) => {
      clearTimeout(timer);
      timer = setTimeout(() => doSearch(q), 500);
    };
  })(), [doSearch]);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  }

  function handleSubmit(e) {
    e.preventDefault();
    doSearch(query);
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1A2818', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
          Search
        </h1>
        <p style={{ fontSize: '13.5px', color: '#6A8068', margin: 0 }}>
          Find saved articles by title or content.
        </p>
      </header>

      {/* Search input */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AB098" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search your saved content..."
              style={{
                width: '100%', padding: '13px 14px 13px 42px', fontSize: '14px',
                border: '1px solid #C0CEB8', borderRadius: '10px',
                background: '#FFFFFF', color: '#1A2818', outline: 'none',
                boxSizing: 'border-box', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#3B6D11'}
              onBlur={e => e.target.style.borderColor = '#C0CEB8'}
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            style={{
              padding: '0 28px', fontSize: '14px', fontWeight: '500',
              background: searching ? '#9AB098' : '#3B6D11', color: '#EAF3DE',
              border: 'none', borderRadius: '10px', cursor: searching ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(42,72,40,0.15)', transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!searching) e.currentTarget.style.background = '#2A5008'; }}
            onMouseLeave={e => { if (!searching) e.currentTarget.style.background = '#3B6D11'; }}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px',
          padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#991B1B',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <p style={{ fontSize: '12px', color: '#7A9870', marginBottom: '16px' }}>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((article) => {
              const date = new Date(article.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              });
              const preview = article.extracted_text
                ? article.extracted_text.slice(0, 200) + '...'
                : 'No preview available.';

              return (
                <article
                  key={article.id}
                  style={{
                    background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)', border: '1px solid #D8ECC8',
                    borderRadius: '12px', padding: '20px',
                    boxShadow: '0 2px 12px -4px rgba(90,110,80,0.04)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#3B6D11';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#D8ECC8';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1A2818', margin: 0, flex: 1 }}>
                      {article.title || 'Untitled'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {article.categories && (
                        <span style={{
                          fontSize: '11px', fontWeight: '600', color: '#3B6D11',
                          background: '#EAF3DE', padding: '3px 8px', borderRadius: '20px',
                          border: '1px solid #C0D8A8',
                        }}>
                          {article.categories}
                        </span>
                      )}
                      <span style={{ fontSize: '12px', color: '#9AB098' }}>{date}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#5A6E58', lineHeight: '1.6', margin: '0 0 12px' }}>
                    {preview}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      fontSize: '12px', color: '#3B6D11', textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {article.url.length > 60 ? article.url.slice(0, 60) + '...' : article.url}
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* No results */}
      {searched && results.length === 0 && !searching && (
        <div style={{ textAlign: 'center', padding: '64px 16px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C0CEB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p style={{ fontSize: '15px', color: '#4A5E48', fontWeight: '500', margin: '0 0 6px' }}>
            No results found for &quot;{query}&quot;
          </p>
          <p style={{ fontSize: '13px', color: '#9AB098', margin: 0 }}>
            Try different keywords or save more content first.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!searched && !searching && (
        <div style={{ textAlign: 'center', padding: '64px 16px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C0CEB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p style={{ fontSize: '15px', color: '#4A5E48', fontWeight: '500', margin: '0 0 6px' }}>
            Search your knowledge base
          </p>
          <p style={{ fontSize: '13px', color: '#9AB098', margin: 0 }}>
            Type anything above to find content you&apos;ve saved.
          </p>
        </div>
      )}
    </div>
  );
}
