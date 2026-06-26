'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Paperclip, Send, Headphones, Image as ImageIcon, File, FileText } from 'lucide-react';

interface InputBarProps {
  onSubmit: (id: string, inputType: string, preview: string) => void;
  prefillText?: string;
  onPrefillConsumed?: () => void;
}

const ACCEPTED = '.mp3,.wav,.m4a,.ogg,.webm,.jpg,.jpeg,.png,.webp,.pdf,.txt';

export default function InputBar({ onSubmit, prefillText, onPrefillConsumed }: InputBarProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefillText) {
      setText(prefillText);
      textRef.current?.focus();
      onPrefillConsumed?.();
    }
  }, [prefillText, onPrefillConsumed]);

  const getFileType = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    if (['mp3','wav','m4a','ogg','webm'].includes(ext)) return 'audio';
    if (['jpg','jpeg','png','webp','bmp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'text';
  };

  const getFileIcon = (type: string) => {
    if (type === 'audio') return <Headphones size={14} />;
    if (type === 'image') return <ImageIcon size={14} />;
    if (type === 'pdf') return <File size={14} />;
    return <FileText size={14} />;
  };

  const submit = useCallback(async () => {
    if ((!text.trim() && !file) || loading) return;
    setLoading(true);

    try {
      let res;
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        res = await fetch('/api/ingest', { method: 'POST', body: fd });
      } else {
        res = await fetch('/api/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text.trim() }),
        });
      }

      const data = await res.json();
      if (data.success) {
        const preview = file ? file.name : text.trim();
        const inputType = file ? getFileType(file) : 'text';
        onSubmit(data.id, inputType, preview);
        setText('');
        setFile(null);
      }
    } catch (err) {
      console.error('[InputBar] Submit error:', err);
    } finally {
      setLoading(false);
    }
  }, [text, file, loading, onSubmit]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const canSubmit = (text.trim().length > 0 || file !== null) && !loading;

  return (
    <div style={{
      padding: '16px 24px 24px',
      background: 'var(--bg)',
      flexShrink: 0,
    }}>
      {/* File preview chip */}
      {file && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px', borderRadius: '99px',
          background: 'var(--accent-light)',
          marginBottom: '10px', maxWidth: '100%',
        }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {getFileIcon(getFileType(file))}
          </span>
          <span style={{
            fontSize: '12px', color: 'var(--accent)', fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: '260px',
          }}>
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            style={{
              color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1,
              padding: '0 2px', flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Input box */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          boxShadow: dragOver ? '0 0 0 2px var(--accent)' : 'none',
          transition: 'box-shadow 0.15s',
          padding: '12px 14px 10px',
        }}
      >
        <textarea
          ref={textRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={file ? 'Add a note about this file...' : 'Describe a sale, paste a bank alert, or drop a file...'}
          rows={1}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: 0,
            margin: 0,
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.5',
            minHeight: '21px',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
          onInput={e => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 120) + 'px';
          }}
        />

        {/* Toolbar row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: '6px',
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {/* File attach */}
            <button
              onClick={() => fileRef.current?.click()}
              title="Attach file"
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', fontSize: '16px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
                e.target.value = '';
              }}
            />

            {/* Mic placeholder */}
            <button
              title="Voice note (coming soon)"
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <Mic size={20} />
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: canSubmit ? 'var(--accent)' : 'var(--bg)',
              color: canSubmit ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              transform: canSubmit ? 'scale(1)' : 'scale(0.95)',
              cursor: canSubmit ? 'pointer' : 'default',
            }}
          >
            {loading ? (
              <span style={{
                width: '12px', height: '12px',
               
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                display: 'block',
                animation: 'spin 0.7s linear infinite',
              }} />
            ) : (
             <Send size={16} style={{ marginLeft: canSubmit ? '2px' : '0' }} />
            )}
          </button>
        </div>
      </div>

      <div style={{
        textAlign: 'center', marginTop: '8px',
        fontSize: '11px', color: 'var(--text-muted)',
      }}>
        Groundwork processes locally. Nothing leaves your device.
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}