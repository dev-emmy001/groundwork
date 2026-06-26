'use client';

import { useEffect, useState } from 'react';
import { FileText, Headphones, Image as ImageIcon, File } from 'lucide-react';

export interface FeedEntry {
  localId: string;       // optimistic ID for render key
  jobId: string;         // server job ID
  inputType: string;
  preview: string;       // raw text or filename
  status: 'pending' | 'processing' | 'complete' | 'failed';
  data?: Record<string, unknown>;
  confidence?: number;
  needsReview?: boolean;
  createdAt?: string;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  text: FileText,
  audio: Headphones,
  image: ImageIcon,
  pdf: File,
};

const TYPE_LABEL: Record<string, string> = {
  text: 'Text',
  audio: 'Voice note',
  image: 'Image',
  pdf: 'Document',
};

function DataField({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined || value === '') return null;
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      <span style={{
        fontSize: '11px', color: 'var(--text-muted)',
        minWidth: '90px', flexShrink: 0, paddingTop: '1px',
        textTransform: 'capitalize',
      }}>
        {label.replace(/_/g, ' ')}
      </span>
      <span style={{
        fontSize: '12px', color: 'var(--text-primary)',
        fontWeight: 500, wordBreak: 'break-word',
      }}>
        {str}
      </span>
    </div>
  );
}

interface RecordCardProps {
  entry: FeedEntry;
  onUpdate: (jobId: string, updates: Partial<FeedEntry>) => void;
}

export default function RecordCard({ entry, onUpdate }: RecordCardProps) {
  const [polling, setPolling] = useState(
    entry.status === 'pending' || entry.status === 'processing'
  );

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${entry.jobId}`);
        const data = await res.json();

        if (data.processing_status === 'complete' || data.processing_status === 'failed') {
          onUpdate(entry.jobId, {
            status: data.processing_status,
            data: data.result?.extracted_json ?? {},
            confidence: data.result?.confidence_score ?? 0,
            needsReview: (data.result?.confidence_score ?? 0) < 0.5,
          });
          setPolling(false);
        }
      } catch { /* silent */ }
    }, 2000);

    return () => clearInterval(interval);
  }, [polling, entry.jobId, onUpdate]);

  const isProcessing = entry.status === 'pending' || entry.status === 'processing';
  const isFailed = entry.status === 'failed';

  // Filter out internal/meta fields from display
  const displayFields = entry.data
    ? Object.entries(entry.data).filter(
        ([k]) => !['type', 'raw', 'status'].includes(k)
      )
    : [];

  return (
    <div
      className="fade-in"
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'none',
        padding: '16px 20px',
        marginBottom: '12px',
        transition: 'none',
      }}
    >
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {(() => {
              const Icon = TYPE_ICON[entry.inputType] || FileText;
              return <Icon size={16} />;
            })()}
          </span>
          <span style={{
            fontSize: '12px', fontWeight: 500,
            color: 'var(--text-secondary)',
          }}>
            {TYPE_LABEL[entry.inputType] ?? entry.inputType}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Review badge */}
          {entry.needsReview && !isProcessing && (
            <div style={{
              padding: '3px 10px', borderRadius: '99px',
              background: 'var(--warning-light)',
              color: 'var(--warning)',
              fontSize: '11px', fontWeight: 500,
            }}>
              Needs review
            </div>
          )}

          {/* Status badge */}
          {isProcessing && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '99px',
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              fontSize: '11px', fontWeight: 500,
            }}>
              <span className="pulse" style={{ fontSize: '7px' }}>●</span>
              Processing
            </div>
          )}

          {isFailed && (
            <div style={{
              padding: '3px 10px', borderRadius: '99px',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              fontSize: '11px', fontWeight: 500,
            }}>
              Failed
            </div>
          )}

          {entry.status === 'complete' && typeof entry.confidence === 'number' && (
            <div style={{
              fontSize: '11px',
              color: entry.confidence >= 0.8
                ? 'var(--accent-green)'
                : 'var(--text-muted)',
              fontWeight: 500,
            }}>
              {(entry.confidence * 100).toFixed(0)}% confidence
            </div>
          )}
        </div>
      </div>

      {/* Preview text */}
      <div style={{
        fontSize: '13px',
        color: 'var(--text-primary)',
        lineHeight: 1.5,
        marginBottom: displayFields.length > 0 ? '12px' : '0',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {entry.preview}
      </div>

      {/* Shimmer skeleton while processing */}
      {isProcessing && (
        <div style={{ marginTop: '10px' }}>
          {[80, 60, 70].map((w, i) => (
            <div
              key={i}
              className="shimmer"
              style={{
                height: '10px', borderRadius: '99px',
                width: `${w}%`, marginBottom: '8px',
              }}
            />
          ))}
        </div>
      )}

      {/* Structured data */}
      {!isProcessing && displayFields.length > 0 && (
        <div style={{
          background: 'var(--bg)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {displayFields.map(([k, v]) => (
            <DataField key={k} label={k} value={v} />
          ))}
        </div>
      )}

      {/* Timestamp */}
      {entry.createdAt && (
        <div style={{
          marginTop: '10px', fontSize: '11px',
          color: 'var(--text-muted)', textAlign: 'right',
        }}>
          {new Date(entry.createdAt).toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
}