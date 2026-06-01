'use client';
// app/dashboard/search/page.jsx
// Full-text search across saved articles

import { useState, useCallback } from 'react';
import { searchArticles } from '../../../lib/api';

// Debounce utility — waits 400ms after user stops typing before searching
function useDebounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function ArticleCard({ article }) {
  const date = new Date(article.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const preview = article.extracted_text
    ? article.extracted_text.slice(0, 200) + '...'
    : 'No preview available.';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm leading-snug truncate">
            {article.title || 'Untitled'}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">{date}</p>
        </div>
        {article.categories && (
          <span className="text-xs bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full shrink-0">
            {article.categories}
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-3">
        {preview}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs text-purple-400 hover:text-purple-300 truncate max-w-full transition"
      >
        {article.url}
      </a>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function doSearch(q) {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await searchArticles(q);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Debounced search — fires 500ms after user stops typing
  const debouncedSearch = useCallback(
    (() => {
      let timer;
      return (q) => {
        clearTimeout(timer);
        timer = setTimeout(() => doSearch(q), 500);
      };
    })(),
    []
  );

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    doSearch(query);
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Search</h2>
        <p className="text-gray-400 mt-1 text-sm">Find saved articles by title or content.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">⌕</span>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search your saved content..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs animate-pulse">
              Searching...
            </span>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && results.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No results found for &quot;{query}&quot;</p>
          <p className="text-gray-600 text-xs mt-1">Try different keywords or save more content.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-4">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state before any search */}
      {!searched && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">⌕</p>
          <p className="text-gray-400 text-sm">Type something to search your knowledge base</p>
        </div>
      )}
    </div>
  );
}
