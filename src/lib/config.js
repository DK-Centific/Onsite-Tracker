// public/config.js sets window.ONSITE_CONFIG, so the site can be reconfigured
// on GitHub Pages without rebuilding.
export const CFG = Object.assign(
  { readUrl: '', writeUrl: '', project: '', stations: [], shiftHours: 6, earlyGraceMinutes: 15 },
  typeof window !== 'undefined' ? window.ONSITE_CONFIG : {},
);
export const READ_URL = String(CFG.readUrl || '').trim();
export const WRITE_URL = String(CFG.writeUrl || '').trim();
export const DEMO = !READ_URL || !WRITE_URL;
