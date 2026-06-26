export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { recoverStuckJobs } = await import('@/lib/queue-worker');
      const { startPoller } = await import('@/lib/queue-poller');
      const { startThermalMonitor } = await import('@/lib/thermal-monitor');
  
      recoverStuckJobs();
      startPoller();
      startThermalMonitor();
  
      console.log('[Boot] Startup recovery scan complete');
      console.log('[Boot] Queue poller started');
      console.log('[Boot] Thermal monitor started');
    }
  }