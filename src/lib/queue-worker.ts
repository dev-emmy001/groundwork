import db from '@/db/db';
import { randomUUID } from 'crypto';

type ProcessingStatus = 'pending' | 'processing' | 'complete' | 'failed';

interface RawLog {
  id: string;
  input_type: string;
  raw_content: string;
  processing_status: ProcessingStatus;
}

interface LedgerEntry {
  id: string;
  log_id: string;
  extracted_json: string;
  confidence_score: number;
}

// Resets ghost rows from crashed or interrupted sessions
export function recoverStuckJobs() {
  const result = db.prepare(
    `UPDATE raw_logs SET processing_status = 'pending'
     WHERE processing_status = 'processing'`
  ).run();

  if (result.changes > 0) {
    console.log(`[Recovery] Reset ${result.changes} stuck job(s) to pending`);
  }
}

// Pulls the oldest pending item
function getNextPendingJob(): RawLog | undefined {
  return db.prepare(
    `SELECT id, input_type, raw_content, processing_status
     FROM raw_logs
     WHERE processing_status = 'pending'
     ORDER BY created_at ASC
     LIMIT 1`
  ).get() as RawLog | undefined;
}

function setStatus(id: string, status: ProcessingStatus) {
  db.prepare(
    `UPDATE raw_logs SET processing_status = ? WHERE id = ?`
  ).run(status, id);
}

function saveLedgerEntry(entry: LedgerEntry) {
  db.prepare(
    `INSERT INTO operational_ledger (id, log_id, extracted_json, confidence_score)
     VALUES (?, ?, ?, ?)`
  ).run(entry.id, entry.log_id, entry.extracted_json, entry.confidence_score);
}

async function checkIfTextPDF(filePath: string): Promise<boolean> {
    // A PDF with extractable text will have content length > threshold
    // We'll implement this properly when we wire pdf-parse
    // For now, treat all PDFs as scanned (safer default)
    return false;
  }
// Phase B stub - Whisper / Tesseract will slot in here
async function runPreProcessor(job: RawLog): Promise<string> {
  switch (job.input_type) {
    case 'audio':
      // TODO: Whisper integration
      console.log(`[PreProcessor] Audio job ${job.id} - Whisper pending`);
      return job.raw_content;

    case 'image':
        case 'pdf':
            const isPureText = await checkIfTextPDF(job.raw_content);
            if (isPureText) {
              // TODO: extract text directly with pdf-parse
              console.log(`[PreProcessor] Text PDF job ${job.id}`);
            } else {
              // TODO: convert pages to images, run Tesseract on each
              console.log(`[PreProcessor] Scanned PDF job ${job.id} - OCR path`);
            }
            return job.raw_content;

    case 'text':
    default:
      console.log(`[PreProcessor] Text job ${job.id} - passthrough`);
      return job.raw_content;
  }
}

// Phase C stub - llama.cpp + GBNF will slot in here
async function runAIStructuring(
  jobId: string,
  rawText: string
): Promise<{ json: string; confidence: number }> {
  // TODO: llama.cpp integration
  console.log(`[AI] Structuring job ${jobId}:`, rawText.slice(0, 80));

  // Placeholder output until llama.cpp is wired
  return {
    json: JSON.stringify({
      type: 'unknown',
      raw: rawText,
      status: 'pending_ai_integration',
    }),
    confidence: 0,
  };
}

// Main worker - processes one job per call
export async function processNextJob(): Promise<boolean> {
  const job = getNextPendingJob();
  if (!job) return false; // queue empty

  setStatus(job.id, 'processing');

  try {
    // Phase B: pre-processing
    const rawText = await runPreProcessor(job);

    // Persist extracted text
    db.prepare(
      `UPDATE raw_logs SET raw_content = ? WHERE id = ?`
    ).run(rawText, job.id);

    // Phase C: AI structuring
    const { json, confidence } = await runAIStructuring(job.id, rawText);

    saveLedgerEntry({
      id: randomUUID(),
      log_id: job.id,
      extracted_json: json,
      confidence_score: confidence,
    });

    setStatus(job.id, 'complete');
    console.log(`[Queue] Job ${job.id} complete`);
    return true;

  } catch (err) {
    console.error(`[Queue] Job ${job.id} failed:`, err);
    setStatus(job.id, 'failed');
    return false;
  }
}

// Drains the full queue sequentially - one job at a time
export async function drainQueue(): Promise<void> {
  let processed = true;
  while (processed) {
    processed = await processNextJob();
  }
  console.log('[Queue] Queue drained');
}