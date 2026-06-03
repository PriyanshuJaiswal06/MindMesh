'use client';
// app/dashboard/layout.jsx

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('mindmesh_token');
    document.cookie = 'mindmesh_token=; path=/; max-age=0';
    window.location.href = '/login';
  
  };

  const navItems = [
    { name: 'Workspace Base', path: '/dashboard', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    )},
    { name: 'Semantic Search', path: '/dashboard/search', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    )},
    { name: 'Ask Context AI', path: '/dashboard/ask', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )},
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FDFDFB 0%, #F4F7F2 100%)',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        minWidth: '260px',
        background: 'rgba(253, 253, 251, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid #D0DCC8',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        boxSizing: 'border-box'
      }}>
        
        <div>
          {/* Brand Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', background: '#3B6D11',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EAF3DE" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontWeight: '600', fontSize: '15px', color: '#1A2818', letterSpacing: '-0.3px' }}>MindMesh</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  background: isActive ? '#3B6D11' : 'transparent',
                  color: isActive ? '#EAF3DE' : '#5A6E58',
                  border: isActive ? '1px solid #2A5008' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 6px rgba(59, 109, 17, 0.15)' : 'none'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}

            {/* Subtle Divider Line */}
            <div style={{ 
              height: '1px', 
              background: '#D0DCC8', 
              margin: '16px 4px 10px 4px' 
            }} />

            {/* Clean Sign Out Option */}
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '500',
                color: '#6A8068',
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(154, 176, 152, 0.12)';
                e.currentTarget.style.color = '#1A2818';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6A8068';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ minWidth: '16px' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Primary Workspace Panel */}
      <main style={{
        flex: 1,
        padding: '48px 64px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>

    </div>
  );
}