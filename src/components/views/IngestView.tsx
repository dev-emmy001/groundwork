'use client';

import { UploadCloud, File, FileText, FileImage, FileAudio, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const RECENT_FILES = [
  { name: 'bank_statement_june.pdf', type: 'pdf', size: '2.4 MB', status: 'Completed', time: '2 mins ago' },
  { name: 'receipt_0892.jpg', type: 'image', size: '1.1 MB', status: 'Processing', time: 'Just now' },
  { name: 'voice_note_14.m4a', type: 'audio', size: '800 KB', status: 'Failed', time: '1 hour ago' },
];

export default function IngestView() {
  const getIcon = (type: string) => {
    if (type === 'pdf') return <FileText size={20} color="var(--accent)" />;
    if (type === 'image') return <FileImage size={20} color="var(--accent)" />;
    if (type === 'audio') return <FileAudio size={20} color="var(--accent)" />;
    return <File size={20} color="var(--accent)" />;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle2 size={16} color="var(--accent-green)" />;
    if (status === 'Processing') return <Clock size={16} color="var(--warning)" />;
    return <AlertCircle size={16} color="var(--danger)" />;
  };

  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Ingest Data
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Upload receipts, invoices, or voice notes. Groundwork will automatically extract and structure the data.
        </p>
      </div>

      {/* Upload Zone */}
      <div style={{ 
        border: '2px dashed var(--border)', borderRadius: '16px', background: 'var(--surface)', 
        padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', textAlign: 'center', marginBottom: '40px', cursor: 'pointer',
      }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-light)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
        }}>
          <UploadCloud size={32} color="var(--accent)" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Click to upload or drag and drop
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px' }}>
          Supported formats: PDF, JPG, PNG, MP3, WAV, M4A, TXT. Maximum file size 50MB.
        </p>
        <button style={{ 
          background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 24px', 
          borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
        }}>
          Select Files
        </button>
      </div>

      {/* Recent Uploads */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Recent Uploads
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {RECENT_FILES.map((file, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', padding: '16px', 
              background: 'var(--surface)', border: '1px solid var(--border)', 
              borderRadius: '12px', gap: '16px'
            }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-light)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {getIcon(file.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.time}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {getStatusIcon(file.status)}
                <span style={{ 
                  color: file.status === 'Completed' ? 'var(--accent-green)' : file.status === 'Processing' ? 'var(--warning)' : 'var(--danger)' 
                }}>
                  {file.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
