'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LogoutButton({ variant = 'sidebar' }: { variant?: 'sidebar' | 'nav' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (variant === 'nav') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--ink-mid)',
          background: 'none',
          border: '1.5px solid #E0DDD8',
          borderRadius: 8,
          padding: '6px 14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 0.15s',
          fontFamily: 'inherit',
        }}
      >
        {loading ? '…' : 'Sign out'}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        background: 'none',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        padding: '8px 0',
        fontSize: 13,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.45)',
        opacity: loading ? 0.6 : 1,
        transition: 'color 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)')
      }
    >
      <span style={{ fontSize: 16 }}>↩</span>
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
