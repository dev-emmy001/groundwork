import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import db from '@/db/db';
// import { processNextJob } from '@/lib/queue-worker';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function detectInputType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (['.mp3', '.wav', '.m4a', '.ogg', '.webm'].includes(ext)) return 'audio';
  if (['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(ext)) return 'image';
  if (ext === '.pdf') return 'pdf';
  return 'text';
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let inputType = 'text';
    let rawContent = '';
    let filePath: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      // File upload
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const textContent = formData.get('text') as string | null;

      if (file) {
        inputType = detectInputType(file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${randomUUID()}-${file.name}`;
        filePath = path.join(UPLOAD_DIR, filename);
        fs.writeFileSync(filePath, buffer);
        rawContent = filePath; // store path for pre-processor
      } else if (textContent) {
        inputType = 'text';
        rawContent = textContent;
      } else {
        return NextResponse.json(
          { error: 'No file or text provided' },
          { status: 400 }
        );
      }
    } else {
      // Raw JSON text input
      const body = await req.json();
      if (!body.text) {
        return NextResponse.json(
          { error: 'No text provided' },
          { status: 400 }
        );
      }
      inputType = 'text';
      rawContent = body.text;
    }

    // Write pending row to SQLite
    const id = randomUUID();
    db.prepare(
      `INSERT INTO raw_logs (id, input_type, raw_content, processing_status)
       VALUES (?, ?, ?, 'pending')`
    ).run(id, inputType, rawContent);
    console.log('[Ingest] DB file:', db.name);
    const verify = db.prepare('SELECT id FROM raw_logs WHERE id = ?').get(id);
    console.log('[Ingest] Verify write:', verify);
    console.log(`[Ingest] Job ${id} queued (${inputType})`);

    // Trigger queue worker asynchronously - don't await
    // UI gets instant response; processing happens in background
    const { wakePoller } = await import('@/lib/queue-poller');
    wakePoller();

    return NextResponse.json({
      success: true,
      id,
      input_type: inputType,
      status: 'pending',
    });

  } catch (err) {
    console.error('[Ingest] Error:', err);
    return NextResponse.json(
      { error: 'Ingestion failed' },
      { status: 500 }
    );
  }
}