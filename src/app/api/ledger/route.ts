import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

interface LedgerRow {
  id: string;
  log_id: string;
  extracted_json: string;
  confidence_score: number;
  created_at: string;
  input_type: string;
  raw_content: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status'); // 'unknown' filters unreviewed

    let query = `
      SELECT
        ol.id,
        ol.log_id,
        ol.extracted_json,
        ol.confidence_score,
        ol.created_at,
        rl.input_type,
        rl.raw_content
      FROM operational_ledger ol
      JOIN raw_logs rl ON ol.log_id = rl.id
    `;

    const params: (string | number)[] = [];

    if (status === 'unknown') {
      query += ` WHERE ol.confidence_score < 0.5 OR ol.confidence_score IS NULL`;
    }

    query += ` ORDER BY ol.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = db.prepare(query).all(...params) as LedgerRow[];

    const entries = rows.map(row => ({
      id: row.id,
      log_id: row.log_id,
      input_type: row.input_type,
      confidence_score: row.confidence_score,
      created_at: row.created_at,
      data: (() => {
        try {
          return JSON.parse(row.extracted_json);
        } catch {
          return { raw: row.extracted_json };
        }
      })(),
      needs_review: row.confidence_score < 0.5 || row.confidence_score === null,
    }));

    // Summary counts
    const summary = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN processing_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN processing_status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN processing_status = 'complete' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN processing_status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM raw_logs
    `).get() as Record<string, number>;

    return NextResponse.json({
      entries,
      summary,
      pagination: {
        limit,
        offset,
        has_more: rows.length === limit,
      },
    });

  } catch (err) {
    console.error('[Ledger] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch ledger' },
      { status: 500 }
    );
  }
}