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
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1A2818', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
          Save to MindMesh
        </h2>
        <p style={{ fontSize: '14px', color: '#6A8068', margin: 0 }}>
          Save a webpage or upload a PDF. Your context engine processes and indexes the material automatically into isolated vector maps.
        </p>
      </div>

      {/* Structured Two-Column Flex Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: '32px', 
        marginBottom: '40px' 
      }}>

        {/* ── Save URL Card ── */}
        <div style={{
          flex: '1 1 400px',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid #D8ECC8',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px -2px rgba(90, 110, 80, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A2818', margin: '0 0 8px', letterSpacing: '-0.1px' }}>
              Capture Web Intelligence
            </h3>
            <p style={{ fontSize: '13px', color: '#6A8068', lineHeight: '1.6', margin: '0 0 24px' }}>
              Provide an article or documentation link. MindMesh cleans out background noise, script blocks, and extracts the core text.
            </p>
          </div>

          <form onSubmit={handleSaveUrl} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com/article"
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '13.5px',
                border: '1px solid #C0CEB8',
                borderRadius: '8px',
                background: '#FFFFFF',
                color: '#1A2818',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={e => e.target.style.borderColor = '#3B6D11'}
              onBlur={e => e.target.style.borderColor = '#C0CEB8'}
            />

            {urlError && (
              <p style={{ fontSize: '13px', color: '#991B1B', background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 12px', borderRadius: '8px', margin: 0 }}>
                {urlError}
              </p>
            )}
            {urlSuccess && (
              <p style={{ fontSize: '13px', color: '#2A5008', background: '#EBF5E6', border: '1px solid #C0D8A8', padding: '10px 12px', borderRadius: '8px', margin: 0 }}>
                {urlSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={urlLoading || !url.trim()}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: '500',
                background: urlLoading ? '#9AB098' : '#3B6D11',
                color: '#EAF3DE',
                border: 'none',
                borderRadius: '8px',
                cursor: urlLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(42, 72, 40, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              {urlLoading ? 'Saving...' : 'Save article'}
            </button>
          </form>
        </div>

        {/* ── Upload PDF Card ── */}
        <div style={{
          flex: '1 1 400px',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid #D8ECC8',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px -2px rgba(90, 110, 80, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A2818', margin: '0 0 8px', letterSpacing: '-0.1px' }}>
              Upload Knowledge Documents
            </h3>
            <p style={{ fontSize: '13px', color: '#6A8068', lineHeight: '1.6', margin: '0 0 24px' }}>
              Drop or select research briefs, text archives, or structural whitepapers. Content fragments map directly locally.
            </p>
          </div>

          <form onSubmit={handleUploadPdf} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #C0D8A8',
                borderRadius: '12px',
                padding: '28px 16px',
                textAlign: 'center',
                background: 'rgba(237, 242, 235, 0.4)',
                cursor: pdfLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7854" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>

              {pdfFile ? (
                <div style={{ maxWidth: '100%' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#1A2818', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{pdfFile.name}</p>
                  <p style={{ fontSize: '11px', color: '#7A9870', margin: '4px 0 0 0' }}>
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#2A4828', margin: 0 }}>Click to choose a document</p>
                  <p style={{ fontSize: '11px', color: '#7A9870', margin: '4px 0 0 0' }}>Only .pdf data fragments accepted</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {pdfError && (
              <p style={{ fontSize: '13px', color: '#991B1B', background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 12px', borderRadius: '8px', margin: 0 }}>
                {pdfError}
              </p>
            )}
            {pdfSuccess && (
              <p style={{ fontSize: '13px', color: '#2A5008', background: '#EBF5E6', border: '1px solid #C0D8A8', padding: '10px 12px', borderRadius: '8px', margin: 0 }}>
                {pdfSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={pdfLoading || !pdfFile}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: '500',
                background: pdfLoading ? '#9AB098' : '#3B6D11',
                color: '#EAF3DE',
                border: 'none',
                borderRadius: '8px',
                cursor: pdfLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(42, 72, 40, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              {pdfLoading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Status Grid */}
      <div style={{
        borderTop: '1px solid #D0DCC8',
        paddingTop: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7A9870', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Pipeline Mode</div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1A2818', marginTop: '2px' }}>PGVector Clustering Active</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#7A9870', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Destination Space</div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1A2818', marginTop: '2px' }}>Isolated Personal Context Engine</div>
        </div>
      </div>

    </div>
  );
}