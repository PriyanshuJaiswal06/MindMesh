'use client';
// app/dashboard/page.jsx
// Main dashboard — save a URL or upload a PDF

import { useState, useRef } from 'react';
import { saveArticle, uploadPDF } from '../../lib/api';

export default function DashboardPage() {
  // URL save state
  const [url, setUrl] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlSuccess, setUrlSuccess] = useState('');
  const [urlError, setUrlError] = useState('');

  // PDF upload state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState('');
  const [pdfError, setPdfError] = useState('');
  const fileInputRef = useRef(null);

  // ── Save URL ──────────────────────────────────────────────────────────────

  async function handleSaveUrl(e) {
    e.preventDefault();
    setUrlError('');
    setUrlSuccess('');

    if (!url.trim()) return;
    setUrlLoading(true);

    try {
      const saved = await saveArticle(url.trim(), '');
      setUrlSuccess(`Saved! Article ID: ${saved.id}. AI is processing it in the background.`);
      setUrl('');
    } catch (err) {
      setUrlError(err.message);
    } finally {
      setUrlLoading(false);
    }
  }

  // ── Upload PDF ────────────────────────────────────────────────────────────

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setPdfError('Only PDF files are allowed');
      return;
    }
    setPdfFile(file);
    setPdfError('');
  }

  async function handleUploadPdf(e) {
    e.preventDefault();
    if (!pdfFile) return;
    setPdfError('');
    setPdfSuccess('');
    setPdfLoading(true);

    try {
      const saved = await uploadPDF(pdfFile);
      setPdfSuccess(`PDF uploaded! "${saved.title}" saved with ID: ${saved.id}.`);
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setPdfError(err.message);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Save to MindMesh</h2>
        <p className="text-gray-400 mt-1 text-sm">
          Save a webpage or upload a PDF. AI will process and index it automatically.
        </p>
      </div>

      {/* ── Save URL card ──────────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-purple-400">⊕</span> Save a webpage
        </h3>

        <form onSubmit={handleSaveUrl} className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com/article"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
          />

          {urlError && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 px-3 py-2 rounded-lg">{urlError}</p>
          )}
          {urlSuccess && (
            <p className="text-green-400 text-sm bg-green-900/20 border border-green-800 px-3 py-2 rounded-lg">{urlSuccess}</p>
          )}

          <button
            type="submit"
            disabled={urlLoading || !url.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            {urlLoading ? 'Saving...' : 'Save article'}
          </button>
        </form>
      </div>

      {/* ── Upload PDF card ────────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-purple-400">⊕</span> Upload a PDF
        </h3>

        <form onSubmit={handleUploadPdf} className="space-y-3">
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-lg px-6 py-8 text-center cursor-pointer hover:border-purple-600/50 hover:bg-purple-600/5 transition"
          >
            {pdfFile ? (
              <div>
                <p className="text-white text-sm font-medium">{pdfFile.name}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-300 text-sm">Click to choose a PDF</p>
                <p className="text-gray-500 text-xs mt-1">Only .pdf files accepted</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {pdfError && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 px-3 py-2 rounded-lg">{pdfError}</p>
          )}
          {pdfSuccess && (
            <p className="text-green-400 text-sm bg-green-900/20 border border-green-800 px-3 py-2 rounded-lg">{pdfSuccess}</p>
          )}

          <button
            type="submit"
            disabled={pdfLoading || !pdfFile}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            {pdfLoading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
      </div>

      {/* Tip */}
      <p className="text-gray-600 text-xs mt-5 text-center">
        After saving, go to <span className="text-gray-400">Search</span> to find content or <span className="text-gray-400">Ask AI</span> to chat with your knowledge base.
      </p>
    </div>
  );
}
