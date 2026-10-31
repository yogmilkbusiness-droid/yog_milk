/**
 * Configuration and utility to simulate realistic network latency (250ms–500ms)
 * during the frontend mock-data phase.
 */
export const mockLatencyConfig = {
  isEnabled: true,
  defaultMinMs: 250,
  defaultMaxMs: 500,
  disableForTesting(): void {
    this.isEnabled = false;
  },
  enable(): void {
    this.isEnabled = true;
  },
};

export async function mockLatency(minMs?: number, maxMs?: number): Promise<void> {
  if (!mockLatencyConfig.isEnabled) return;
  const min = minMs ?? mockLatencyConfig.defaultMinMs;
  const max = maxMs ?? mockLatencyConfig.defaultMaxMs;
  const range = max > min ? max - min + 1 : 1;
  const delay = Math.floor(Math.random() * range) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
