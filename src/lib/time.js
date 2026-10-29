export const pad = (n) => String(n).padStart(2, '0');
export const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mondayOf = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};
export const hoursBetween = (a, b) => (b - a) / 36e5;

export const fmtTime = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
export const fmtDay = (d) => d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
export const fmtLongDay = (d) => d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
export const fmtHrs = (h) => (Math.round(h * 10) / 10).toFixed(1);
// 2.25 -> "2:15"
export const fmtClock = (h) => {
  const m = Math.max(0, Math.floor(h * 60));
  return `${Math.floor(m / 60)}:${pad(m % 60)}`;
};
export const weekLabel = (wk0) => {
  const end = addDays(wk0, 6);
  const same = wk0.getMonth() === end.getMonth();
  const a = wk0.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const b = end.toLocaleDateString([], same ? { day: 'numeric' } : { month: 'short', day: 'numeric' });
  return `${a} – ${b}`;
};
export const greeting = (d = new Date()) => {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};
export const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('');
// Full name for lane labels; a long one ("Alexandra Montgomery-Whitfield") shortens to
// "Alexandra M." so it stays on one short line.
export const LABEL_MAX = 18;
export const shortName = (name) => { const full = name.trim().replace(/\s+/g, ' '); const p = full.split(' '); return full.length <= LABEL_MAX || p.length < 2 ? full : `${p[0]} ${p[p.length - 1][0].toUpperCase()}.`; };
export const firstName = (name) => name.trim().split(/\s+/)[0] || name;
