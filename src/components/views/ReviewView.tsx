'use client';

import { Check, X, AlertTriangle, MessageSquareCode } from 'lucide-react';

const REVIEW_ITEMS = [
  {
    id: 'REV-092',
    confidence: '45%',
    sourceText: 'Paid 45k for the new generator repair to Chuks yesterday.',
    extracted: {
      Amount: '45,000',
      Category: 'Repairs',
      Vendor: 'Chuks',
      Date: '2026-06-25'
    }
  },
  {
    id: 'REV-093',
    confidence: '60%',
    sourceText: 'Bought diesel 20k',
    extracted: {
      Amount: '20,000',
      Category: 'Fuel',
      Vendor: 'Unknown',
      Date: '2026-06-26'
    }
  }
];

export default function ReviewView() {
  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Needs Review
          <span style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontSize: '12px', padding: '4px 10px', borderRadius: '99px', fontWeight: 600 }}>
            {REVIEW_ITEMS.length} items
          </span>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Review and correct low-confidence extractions before they are posted to the ledger.
        </p>
      </div>

      {/* Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {REVIEW_ITEMS.map((item, i) => (
          <div key={i} style={{ 
            background: 'var(--surface)', border: '1px solid var(--border)', 
            borderRadius: '16px', overflow: 'hidden'
          }}>
            {/* Top Bar */}
            <div style={{ 
              padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                <AlertTriangle size={16} color="var(--warning)" />
                Item {item.id}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Confidence: <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{item.confidence}</span>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '20px', display: 'flex', gap: '24px', flexDirection: 'row' }}>
              {/* Source Snippet */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 600 }}>
                  Source Text
                </div>
                <div style={{ 
                  background: 'var(--bg)', padding: '16px', borderRadius: '8px', 
                  fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic'
                }}>
                  "{item.sourceText}"
                </div>
              </div>

              {/* Extracted Data */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 600 }}>
                  Extracted Data
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(item.extracted).map(([key, value], idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ width: '80px', fontSize: '13px', color: 'var(--text-secondary)' }}>{key}</label>
                      <input type="text" defaultValue={value} style={{ 
                        flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', 
                        background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ 
              padding: '16px 20px', borderTop: '1px solid var(--border)', 
              display: 'flex', justifyContent: 'flex-end', gap: '12px'
            }}>
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: 'var(--bg)', color: 'var(--danger)', 
                border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', 
                fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
              }}>
                <X size={16} />
                Reject
              </button>
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: 'var(--accent)', color: '#fff', 
                border: 'none', padding: '8px 16px', borderRadius: '8px', 
                fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
              }}>
                <Check size={16} />
                Approve & Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
