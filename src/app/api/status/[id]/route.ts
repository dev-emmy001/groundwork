import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

interface RawLog {
  id: string;
  input_type: string;
  raw_content: string;
  processing_status: string;
  created_at: string;
}

interface LedgerEntry {
  id: string;
  log_id: string;
  extracted_json: string;
  confidence_score: number;
  created_at: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
   
    const log = db.prepare(
      `SELECT id, input_type, raw_content, processing_status, created_at
       FROM raw_logs WHERE id = ?`
    ).get(id) as RawLog | undefined;

    if (!log) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // If complete, pull the structured result
    let result: LedgerEntry | undefined;
    if (log.processing_status === 'complete') {
      result = db.prepare(
        `SELECT id, log_id, extracted_json, confidence_score, created_at
         FROM operational_ledger WHERE log_id = ?`
      ).get(id) as LedgerEntry | undefined;
    }

    return NextResponse.json({
      id: log.id,
      input_type: log.input_type,
      processing_status: log.processing_status,
      created_at: log.created_at,
      result: result
        ? {
            extracted_json: JSON.parse(result.extracted_json),
            confidence_score: result.confidence_score,
          }
        : null,
    });

  } catch (err) {
    console.error('[Status] Error:', err);
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}