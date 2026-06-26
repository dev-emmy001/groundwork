'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Home, Book, Inbox, Search, MessageSquare, Settings, Menu } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'ledger', label: 'Ledger', icon: Book },
  { id: 'ingest', label: 'Ingest', icon: Inbox },
  { id: 'review', label: 'Review', icon: Search },
  { id: 'query', label: 'Query', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  const W = expanded ? '220px' : '60px';

  return (
    <aside
      style={{
        width: W,
        minWidth: W,
        height: '100vh',
        background: 'var(--surface)',
        borderRight: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1), min-width 0.2s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        zIndex: 20,
        position: 'relative',
      }}
    >
      {/* Header row: Toggle + Logo */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: expanded ? '0 16px' : '0',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: '12px',
        flexShrink: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        <button
          onClick={() => setExpanded(p => !p)}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            transition: 'background 0.15s, color 0.15s',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--surface-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {expanded && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.2s',
          }}>
            <div style={{
              width: '28px', height: '28px', flexShrink: 0,
              // background: 'var(--accent)',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Image src="/groundworkmascot.png" alt="Groundwork" width={28} height={28} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '14px', fontWeight: 600,
                color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.2
              }}>
                Groundwork
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              title={!expanded ? item.label : undefined}
              style={{
                width: expanded ? 'calc(100% - 24px)' : '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: expanded ? '0 12px' : '0',
                justifyContent: expanded ? 'flex-start' : 'center',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                borderRadius: '8px',
                margin: expanded ? '2px 12px' : '4px auto',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: expanded ? '13px' : '16px',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                flexShrink: 0,
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{
                fontSize: '16px',
                flexShrink: 0,
                width: expanded ? '20px' : 'auto',
                textAlign: 'center',
                display: 'inline-block',
              }}>
                <item.icon size={18} />
              </span>
              {expanded && (
                <span style={{
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.1s',
                  fontSize: '13px',
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>


    </aside>
  );
}