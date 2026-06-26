'use client';

import { User, Bell, Database, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');

  const TABS = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Settings
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Manage your account preferences, integrations, and security.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', flex: 1, minHeight: 0 }}>
        {/* Sidebar Nav */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '8px', border: 'none',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s',
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <tab.icon size={18} />
                  {tab.label}
                </span>
                {isActive && <ChevronRight size={16} />}
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', overflowY: 'auto' }}>
          {/* Mock General Settings Form */}
          <div style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Profile Settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600 }}>
                  V
                </div>
                <button style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Change Avatar
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                <input type="text" defaultValue="Victor" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
                <input type="email" defaultValue="victor@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Company Name</label>
                <input type="text" defaultValue="Groundwork Inc." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '8px' }}>
                <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
