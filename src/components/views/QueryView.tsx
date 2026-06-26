'use client';

import { Send, Bot, User, BarChart3, TrendingUp, Calendar } from 'lucide-react';

export default function QueryView() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Query Analytics
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Ask questions about your business operations and get instant insights.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', gap: '24px', padding: '0 24px 24px', minHeight: 0 }}>
        
        {/* Chat Interface */}
        <div style={{ 
          flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', 
          borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' 
        }}>
          {/* Chat History */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* User Message */}
            <div style={{ display: 'flex', gap: '16px', alignSelf: 'flex-end', maxWidth: '85%' }}>
              <div style={{ background: 'var(--accent)', color: '#fff', padding: '12px 16px', borderRadius: '16px 16px 0 16px', fontSize: '14px', lineHeight: 1.5 }}>
                What were my total sales for last week compared to the previous week?
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color="var(--text-secondary)" />
              </div>
            </div>

            {/* AI Response */}
            <div style={{ display: 'flex', gap: '16px', maxWidth: '85%' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="var(--accent)" />
              </div>
              <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', padding: '16px', borderRadius: '16px 16px 16px 0', fontSize: '14px', lineHeight: 1.5 }}>
                <p style={{ marginBottom: '12px', marginTop: 0 }}>Your total sales for last week (June 14 - June 20) were <strong>₦450,000</strong>. This is a <strong>12% increase</strong> compared to the previous week (₦401,780).</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Last Week</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>₦450k</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Prev Week</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>₦401k</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '4px 8px 4px 16px' }}>
              <input 
                type="text" 
                placeholder="Ask a question..." 
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 0', fontSize: '14px', color: 'var(--text-primary)' }} 
              />
              <button style={{ 
                width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', 
                color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
              }}>
                <Send size={16} style={{ marginLeft: '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Queries Sidebar */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Suggested Queries</h3>
          
          <button style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}>
            <BarChart3 size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Revenue Breakdown</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>Show me revenue grouped by category for this month.</div>
            </div>
          </button>

          <button style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}>
            <TrendingUp size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Top Expenses</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>What were my top 5 biggest expenses in Q2?</div>
            </div>
          </button>

          <button style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}>
            <Calendar size={18} color="var(--accent)" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Outstanding Debt</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>List all pending debts that are overdue.</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
