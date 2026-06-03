'use client';
// app/register/page.jsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Direct hook into your existing lib/api abstraction
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong during account generation.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', 
      background: '#F7FAF5',
      display: 'flex', 
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>

      {/* Left panel — Architecture Context Frame */}
      <div style={{
        width: '420px', 
        minWidth: '420px', 
        background: '#EDF2EB',
        borderRight: '1px solid #D0DCC8', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        padding: '48px 40px',
        boxSizing: 'border-box'
      }}>

        {/* Brand Logo Header Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', background: '#3B6D11',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAF3DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontWeight: '600', fontSize: '17px', color: '#1A2818', letterSpacing: '-0.3px' }}>MindMesh</span>
        </div>

        {/* Informative Copy Section */}
        <div>
          <div style={{
            fontSize: '28px', fontWeight: '600', color: '#1A2818',
            lineHeight: '1.3', letterSpacing: '-0.5px', marginBottom: '16px',
          }}>
            Establish your private node.
          </div>
          <p style={{ fontSize: '14px', color: '#6A8068', lineHeight: '1.7', margin: 0 }}>
            Create an isolated data cluster securely. Your files and index maps are encrypted and never combined into collective public training vectors.
          </p>
        </div>

        {/* Feature Checkpoints (Pure minimal geometric indicators instead of emojis) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { text: 'Dedicated isolated relational context mapping' },
            { text: 'Custom extraction weights for specialized text bodies' },
            { text: 'Zero external tracking or third-party data analytics' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ 
                marginTop: '6px',
                width: '5px', 
                height: '5px', 
                minWidth: '5px',
                borderRadius: '50%', 
                background: '#3B6D11', 
                display: 'inline-block' 
              }} />
              <span style={{ fontSize: '13px', color: '#4A5E48', lineHeight: '1.4' }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Clear Identity Guardrail Footer */}
        <p style={{ fontSize: '12px', color: '#9AB098', margin: 0 }}>
          MindMesh · Autonomous Storage Standards Verified
        </p>
      </div>

      {/* Right panel — Registration Form Area */}
      <div style={{
        flex: 1, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        padding: '48px 40px',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '380px',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(208, 220, 200, 0.5)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 24px -4px rgba(42, 72, 40, 0.03)'
        }}>

          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1A2818', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
            Get started
          </h1>
          <p style={{ fontSize: '14px', color: '#6A8068', margin: '0 0 32px' }}>
            Initialize your local knowledge console
          </p>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px',
              padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#991B1B',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2A4828', marginBottom: '6px' }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Alex Mercer"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '14px',
                  border: '1px solid #C0CEB8', borderRadius: '8px',
                  background: '#FFFFFF', color: '#1A2818', outline: 'none',
                  boxSizing: 'border-box', 
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#3B6D11'}
                onBlur={e => e.target.style.borderColor = '#C0CEB8'}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2A4828', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '14px',
                  border: '1px solid #C0CEB8', borderRadius: '8px',
                  background: '#FFFFFF', color: '#1A2818', outline: 'none',
                  boxSizing: 'border-box', 
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#3B6D11'}
                onBlur={e => e.target.style.borderColor = '#C0CEB8'}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#2A4828', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '14px',
                  border: '1px solid #C0CEB8', borderRadius: '8px',
                  background: '#FFFFFF', color: '#1A2818', outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#3B6D11'}
                onBlur={e => e.target.style.borderColor = '#C0CEB8'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', fontSize: '14px', fontWeight: '500',
                background: loading ? '#9AB098' : '#3B6D11', color: '#EAF3DE',
                border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(42, 72, 40, 0.12)',
                transition: 'background 0.15s', letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Instantiating node...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13.5px', color: '#6A8068', marginTop: '24px', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#3B6D11', fontWeight: '500', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}