'use client';

import { useEffect, useState } from 'react';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning, Merchant';
  if (h < 17) return 'Good afternoon, Merchant';
  return 'Good evening, Merchant';
}

interface Status {
  cooling: boolean;
  pending: number;
  complete: number;
}

export default function Topbar() {
  const [status, setStatus] = useState<Status>({ cooling: false, pending: 0, complete: 0 });

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const [thermal, ledger] = await Promise.all([
          fetch('/api/thermal').then(r => r.json()),
          fetch('/api/ledger').then(r => r.json()),
        ]);
        setStatus({
          cooling: thermal.cooling ?? false,
          pending: ledger.summary?.pending ?? 0,
          complete: ledger.summary?.complete ?? 0,
        });
      } catch { /* silent */ }
    };
    fetch_();
    const t = setInterval(fetch_, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={{
      height: '64px',
      background: 'transparent',
      borderBottom: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Greeting */}
      <div style={{
        fontSize: '14px',
        color: 'var(--text-primary)',
        fontWeight: 500,
      }}>
        {getGreeting()}
      </div>

      {/* Status pills + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {status.cooling && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '99px',
            background: 'var(--warning-light)',
            color: 'var(--warning)', fontSize: '12px', fontWeight: 500,
          }}>
            <span className="pulse" style={{ fontSize: '8px' }}>●</span>
            Cooling off
          </div>
        )}

        {status.pending > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '99px',
            background: 'var(--accent-light)',
            color: 'var(--accent)', fontSize: '12px', fontWeight: 500,
          }}>
            <span className="pulse" style={{ fontSize: '8px' }}>●</span>
            {status.pending} processing
          </div>
        )}

        {status.complete > 0 && (
          <div style={{
            padding: '4px 12px', borderRadius: '99px',
            background: 'var(--accent-green-light)',
            color: 'var(--accent-green)',
            fontSize: '12px', fontWeight: 500,
          }}>
            {status.complete} records
          </div>
        )}


      </div>
    </header>
  );
}