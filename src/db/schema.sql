CREATE TABLE IF NOT EXISTS raw_logs (
    id TEXT PRIMARY KEY,
    input_type TEXT NOT NULL,
    raw_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_processed BOOLEAN DEFAULT 0,
    processing_status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS operational_ledger (
    id TEXT PRIMARY KEY,
    log_id TEXT,
    extracted_json TEXT NOT NULL,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(log_id) REFERENCES raw_logs(id)
);

CREATE TABLE IF NOT EXISTS document_index (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_kb INTEGER,
    document_summary TEXT,
    last_indexed DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_history (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);