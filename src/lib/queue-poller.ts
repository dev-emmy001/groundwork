import { drainQueue } from '@/lib/queue-worker';

let isPolling = false;
let pollTimer: NodeJS.Timeout | null = null;
let isProcessing = false;

const POLL_INTERVAL_MS = 3000; // check every 3 seconds
const IDLE_TIMEOUT_MS = 60000; // stop polling after 60s of empty queue

let lastJobTime = Date.now();

async function poll() {
  if (isProcessing) return; // enforce FIFO(first in, first out)

  isProcessing = true;
  try {
    await drainQueue();
    const timeSinceLastJob = Date.now() - lastJobTime;

    if (timeSinceLastJob > IDLE_TIMEOUT_MS) {
        console.log('[Poller] idle timeout reached,suspending...');
        stopPoller();
      }
    } catch (err) {
      console.error('[Poller] Error during drain:', err);
    } finally {
      isProcessing = false;
    }
}

export function startPoller() {
  if (isPolling) return;
  isPolling = true;
  lastJobTime = Date.now();
  console.log('[Poller] Started');
  pollTimer = setInterval(poll, POLL_INTERVAL_MS);
}

export function stopPoller() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  isPolling = false;
  console.log('[Poller] Stopped');
}

export function wakePoller() {
  lastJobTime = Date.now(); // reset idle timer
  if (!isPolling) {
    startPoller();
  }
}