'use client';

import { Search, Filter, Download, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const MOCK_DATA = [
  { id: 'LDG-001', date: '2026-06-26', desc: 'Sold 10 bags of garri to Mama Ngozi', amount: '₦35,000.00', category: 'Sales', status: 'Completed' },
  { id: 'LDG-002', date: '2026-06-25', desc: 'Received 50 cartons of tomato paste', amount: '-₦180,000.00', category: 'Inventory', status: 'Completed' },
  { id: 'LDG-003', date: '2026-06-25', desc: 'Emeka owes from goods collected', amount: '₦15,000.00', category: 'Debt', status: 'Pending' },
  { id: 'LDG-004', date: '2026-06-24', desc: 'Shop rent payment for July', amount: '-₦50,000.00', category: 'Expenses', status: 'Completed' },
  { id: 'LDG-005', date: '2026-06-24', desc: 'GTBank Alert: Credit from CHUKWUDI', amount: '₦45,000.00', category: 'Bank Transfer', status: 'Completed' },
];

export default function LedgerView() {
  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Ledger
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            View, filter, and manage all structured entries.
          </p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          background: 'var(--accent)', color: '#fff', 
          border: 'none', padding: '10px 16px', borderRadius: '8px', 
          fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
        }}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          flex: 1, maxWidth: '320px', position: 'relative', 
          display: 'flex', alignItems: 'center' 
        }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search entries..." 
            style={{ 
              width: '100%', padding: '10px 12px 10px 38px', 
              borderRadius: '8px', border: '1px solid var(--border)', 
              background: 'var(--surface)', color: 'var(--text-primary)', 
              fontSize: '14px', outline: 'none' 
            }} 
          />
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          background: 'var(--surface)', color: 'var(--text-secondary)', 
          border: '1px solid var(--border)', padding: '0 16px', borderRadius: '8px', 
          fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
        }}>
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div style={{ 
        flex: 1, 
        background: 'var(--surface)', 
        borderRadius: '12px', 
        border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-primary)' }}>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }} className="mono">{row.id}</td>
                  <td style={{ padding: '16px 20px' }}>{row.date}</td>
                  <td style={{ padding: '16px 20px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.desc}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {row.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 500, color: row.amount.startsWith('-') ? 'inherit' : 'var(--accent-green)' }}>
                    {row.amount}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 500,
                      background: row.status === 'Completed' ? 'var(--accent-green-light)' : 'var(--warning-light)',
                      color: row.status === 'Completed' ? 'var(--accent-green)' : 'var(--warning)',
                    }}>
                      <span style={{ fontSize: '8px' }}>●</span>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                    <MoreHorizontal size={18} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ 
          padding: '16px 20px', borderTop: '1px solid var(--border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '13px', color: 'var(--text-secondary)'
        }}>
          <div>Showing 1 to 5 of 42 entries</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--border)', 
              background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'not-allowed' 
            }}>
              <ChevronLeft size={16} />
            </button>
            <button style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--border)', 
              background: 'var(--surface)', color: 'var(--text-primary)', cursor: 'pointer' 
            }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
