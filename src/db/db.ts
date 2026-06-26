import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
// import { recoverStuckJobs } from '@/lib/queue-worker';

//  path for the local database file and the schema script
const DB_PATH = path.join(process.cwd(), 'local_database.db');
const SCHEMA_PATH = path.join(process.cwd(), 'src', 'db', 'schema.sql');

// Initialize a local database connection
const db = new Database(DB_PATH);

// Enable Write-Ahead Logging (WAL) mode for fast local performance

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000'); // 64MB page cache


 //Initializes the local database by running the schema file if tables do not exist.

export function initDatabase() {
  try {
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
      db.exec(schemaSql);
    } else {
      console.error(`Schema file not found at: ${SCHEMA_PATH}`);
    }
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
  }
}

// Ensure tables are built immediately when this module is first loaded
initDatabase();
// recoverStuckJobs();

export default db;