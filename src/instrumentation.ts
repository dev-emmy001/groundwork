export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { recoverStuckJobs } = await import('@/lib/queue-worker');
      const { startPoller } = await import('@/lib/queue-poller');
  
      recoverStuckJobs();
      startPoller();
  
      console.log('[Boot] startup recovery scan complete');
      console.log('[Boot] queue poller started');
    }
  }