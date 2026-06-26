'use client';
import Image from "next/image";
import { Receipt, CreditCard, Package, ClipboardList } from 'lucide-react';

interface Chip {
  icon: React.ElementType;
  label: string;
  value: string;
}

const CHIPS: Chip[] = [
  {
    icon: Receipt,
    label: 'Log a sale',
    value: 'Sold 10 bags of garri to Mama Ngozi, 3500 naira each. She paid 25000, owes 10000.',
  },
  {
    icon: CreditCard,
    label: 'Paste a bank alert',
    value: 'GTBank: Cr 45,000.00 from CHUKWUDI OKAFOR. Acct balance: 128,430.00. 14 Jun 2026.',
  },
  {
    icon: Package,
    label: 'Update inventory',
    value: 'Received 50 cartons of tomato paste from supplier. Paid 180,000 naira. Storage: back room.',
  },
  {
    icon: ClipboardList,
    label: 'Record a debt',
    value: 'Emeka owes 15,000 from goods collected on credit last Tuesday. Due by end of month.',
  },
];

interface EmptyStateProps {
  onChipClick: (value: string) => void;
}

export default function EmptyState({ onChipClick }: EmptyStateProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '32px',
    }}>
      {/* Greeting */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
         <Image alt="site mascot" src="/groundworkmascot.png" width={80} height={80}/>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            lineHeight: 1.3,
            margin: 0,
          }}>
            What happened in the market today?
          </h1>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Drop a voice note, receipt, or type what happened.
            Groundwork structures it into your ledger automatically.
          </p>
        </div>
      </div>

      {/* Suggestion chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        width: '100%',
        maxWidth: '560px',
      }}>
        {CHIPS.map(chip => (
          <button
            key={chip.label}
            onClick={() => onChipClick(chip.value)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '14px 16px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'none',
              border: 'none',
              textAlign: 'left',
              transition: 'transform 0.1s, background-color 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--surface)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center' }}>
              <chip.icon size={18} />
            </span>
            <div>
              <div style={{
                fontSize: '13px', fontWeight: 500,
                color: 'var(--text-primary)', marginBottom: '3px',
              }}>
                {chip.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {chip.value}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}