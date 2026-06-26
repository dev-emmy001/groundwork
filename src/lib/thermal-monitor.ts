import { stopPoller, startPoller } from '@/lib/queue-poller';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const TEMP_THRESHOLD_C = 80;      // warn at 80, before the 85 penalty kicks in
const CHECK_INTERVAL_MS = 15000;  // check every 15 seconds
const COOLDOWN_MS = 60000;        // pause queue for 60s when threshold hit

let monitorTimer: NodeJS.Timeout | null = null;
let isCoolingDown = false;
let onCooldownCallback: ((cooling: boolean) => void) | null = null;

// Register a UI callback for the Cooling Off notification
export function onCooldownChange(cb: (cooling: boolean) => void) {
  onCooldownCallback = cb;
}

async function getCPUTemp(): Promise<number | null> {
  try {
    // for Windows: use WMIC
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(
        'wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature'
      );
      const lines = stdout.trim().split('\n').filter(l => l.trim() && !l.includes('Current'));
      if (lines.length === 0) return null;

      // WMIC returns temp in tenths of Kelvin
      const raw = parseInt(lines[0].trim(), 10);
      const celsius = (raw / 10) - 273.15;
      return Math.round(celsius);
    }

    // for Linux/WSL: read from thermal zone
    const { stdout } = await execAsync(
      'cat /sys/class/thermal/thermal_zone0/temp'
    );
    return Math.round(parseInt(stdout.trim(), 10) / 1000);

  } catch {
    // If it can't read temp, return null and skip the check
    return null;
  }
}

async function check() {
  if (isCoolingDown) return;

  const temp = await getCPUTemp();

  if (temp === null) {
    console.log('[Thermal] Could not read CPU temperature, skipping check!');
    return;
  }

  console.log(`[Thermal] CPU temp: ${temp}°C`);

  if (temp >= TEMP_THRESHOLD_C) {
    console.warn(`[Thermal] Threshold hit (${temp}°C), pausing queue!`);
    isCoolingDown = true;
    stopPoller();

    if (onCooldownCallback) onCooldownCallback(true);

    // Resume after cooldown period
    setTimeout(() => {
      isCoolingDown = false;
      startPoller();
      console.log('[Thermal] Cooldown complete, queue resumed!');
      if (onCooldownCallback) onCooldownCallback(false);
    }, COOLDOWN_MS);
  }
}

export function startThermalMonitor() {
  if (monitorTimer) return;
  monitorTimer = setInterval(check, CHECK_INTERVAL_MS);
  console.log('[Thermal] Monitor started');
}

export function stopThermalMonitor() {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
  }
  console.log('[Thermal] Monitor stopped!');
}

export function isCooling(): boolean {
  return isCoolingDown;
}