'use client';

import { useEffect, useState } from 'react';

interface Summary {
  total: number;
  pending: number;
  processing: number;
  complete: number;
  failed: number;
}

interface LedgerEntry {
  id: string;
  input_type: string;
  confidence_score: number;
  created_at: string;
  needs_review: boolean;
  data: Record<string, unknown>;
}

export default function DashboardView() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/ledger?limit=5');
        const data = await res.json();
        setSummary(data.summary);
        setRecent(data.entries);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };

    fetch_();
    const t = setInterval(fetch_, 5000);
    return () => clearInterval(t);
  }, []);

  const StatCard = ({
    label, value, accent = false, warn = false
  }: {
    label: string; value: number | string;
    accent?: boolean; warn?: boolean;
  }) => (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: '20px 24px',
      flex: 1,
    }}>
      <div style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '10px',
      }}>
        {label}
      </div>
      <div className="mono" style={{
        fontSize: '28px',
        fontWeight: 600,
        color: accent
          ? 'var(--accent)'
          : warn
          ? 'var(--danger)'
          : 'var(--text-primary)',
        lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '28px', overflowY: 'auto', height: '100%' }}>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1px', marginBottom: '28px' }}>
        <StatCard label="Total Records" value={summary?.total ?? 0} />
        <StatCard label="Complete" value={summary?.complete ?? 0} accent />
        <StatCard label="Pending" value={summary?.pending ?? 0} />
        <StatCard label="Failed" value={summary?.failed ?? 0} warn={!!summary?.failed} />
      </div>

      {/* Recent entries */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-muted)',
          }}>
            Recent Entries
          </span>
          <span className="mono" style={{
            fontSize: '10px',
            color: 'var(--text-dim)',
          }}>
            Last 5
          </span>
        </div>

        {loading && (
          <div style={{ padding: '40px 20px', textAlign: 'center',
            color: 'var(--text-dim)', fontSize: '12px' }}>
            Loading...
          </div>
        )}

        {!loading && recent.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center',
            color: 'var(--text-muted)', fontSize: '12px' }}>
            No records yet. Drop a file or text to get started.
          </div>
        )}

        {recent.map((entry, i) => (
          <div key={entry.id} style={{
            padding: '14px 20px',
            borderBottom: i < recent.length - 1
              ? '1px solid var(--border)'
              : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            {/* Type badge */}
            <div className="mono" style={{
              fontSize: '9px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              minWidth: '36px',
            }}>
              {entry.input_type}
            </div>

            {/* Data preview */}
            <div style={{
              flex: 1,
              fontSize: '11px',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {JSON.stringify(entry.data)}
            </div>

            {/* Review flag */}
            {entry.needs_review && (
              <div style={{
                fontSize: '10px',
                color: 'var(--warning)',
                flexShrink: 0,
              }}>
                Review
              </div>
            )}

            {/* Confidence */}
            <div className="mono" style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              flexShrink: 0,
              minWidth: '32px',
              textAlign: 'right',
            }}>
              {(entry.confidence_score * 100).toFixed(0)}%
            </div>

            {/* Time */}
            <div className="mono" style={{
              fontSize: '10px',
              color: 'var(--text-dim)',
              flexShrink: 0,
            }}>
              {new Date(entry.created_at).toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}