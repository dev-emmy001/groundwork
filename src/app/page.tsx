'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import EmptyState from '@/components/EmptyState';
import InputBar from '@/components/InputBar';
import RecordCard, { FeedEntry } from '@/components/RecordCard';

import { Construction } from 'lucide-react';

import LedgerView from '@/components/views/LedgerView';
import IngestView from '@/components/views/IngestView';
import ReviewView from '@/components/views/ReviewView';
import QueryView from '@/components/views/QueryView';
import SettingsView from '@/components/views/SettingsView';

export default function Home() {
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [prefillText, setPrefillText] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feed.length > 0) {
      feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [feed.length]);

  // Load existing records on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/ledger?limit=20');
        const data = await res.json();
        if (data.entries?.length > 0) {
          const existing: FeedEntry[] = data.entries.map((e: any) => ({
            localId: e.id,
            jobId: e.log_id,
            inputType: e.input_type,
            preview: e.data?.raw
              ? String(e.data.raw).slice(0, 120)
              : 'Processed record',
            status: 'complete' as const,
            data: e.data,
            confidence: e.confidence_score,
            needsReview: e.needs_review,
            createdAt: e.created_at,
          }));
          setFeed(existing.reverse());
        }
      } catch { /* silent */ }
    };
    load();
  }, []);

  const handleSubmit = useCallback((
    jobId: string,
    inputType: string,
    preview: string
  ) => {
    const entry: FeedEntry = {
      localId: `local-${Date.now()}`,
      jobId,
      inputType,
      preview,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setFeed(prev => [...prev, entry]);
  }, []);

  const handleUpdate = useCallback((
    jobId: string,
    updates: Partial<FeedEntry>
  ) => {
    setFeed(prev =>
      prev.map(e => e.jobId === jobId ? { ...e, ...updates } : e)
    );
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* Collapsible sidebar */}
      <Sidebar active={activeView} onChange={setActiveView} />

      {/* Main area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <Topbar />

        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
        }}>
          {activeView === 'dashboard' ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              maxWidth: '720px',
              width: '100%',
              margin: '0 auto',
              padding: '0 16px',
              minWidth: 0,
            }}>
              {feed.length === 0 ? (
                <EmptyState onChipClick={setPrefillText} />
              ) : (
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '24px 0 8px',
                }}>
                  {feed.map(entry => (
                    <RecordCard
                      key={entry.localId}
                      entry={entry}
                      onUpdate={handleUpdate}
                    />
                  ))}
                  <div ref={feedEndRef} />
                </div>
              )}
              <InputBar
                onSubmit={handleSubmit}
                prefillText={prefillText}
                onPrefillConsumed={() => setPrefillText('')}
              />
            </div>
          ) : activeView === 'ledger' ? (
            <LedgerView />
          ) : activeView === 'ingest' ? (
            <IngestView />
          ) : activeView === 'review' ? (
            <ReviewView />
          ) : activeView === 'query' ? (
            <QueryView />
          ) : activeView === 'settings' ? (
            <SettingsView />
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
              color: 'var(--text-muted)',
            }}>
              <div><Construction size={48} strokeWidth={1.5} /></div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)} — coming soon
              </div>
              <div style={{ fontSize: '12px' }}>
                We're building this next.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}