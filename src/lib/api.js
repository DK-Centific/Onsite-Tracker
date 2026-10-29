import { CFG, DEMO, READ_URL, WRITE_URL } from './config.js';
import { addDays, dayKey, mondayOf } from './time.js';

export const storage = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  remove(k) { try { localStorage.removeItem(k); } catch { /* private mode */ } },
};

async function paPost(url, body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      cache: 'no-store',
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const out = await r.json();
    if (out && out.error) throw new Error(out.error);
    return out;
  } catch (e) {
    throw e.name === 'AbortError' ? new Error('timed out') : e;
  } finally {
    clearTimeout(t);
  }
}

// Excel rows can come back with odd casing, numbers as text, or dates as serials.
export function normPunch(p) {
  let ts = p.ts ?? p.Timestamp;
  if (typeof ts === 'number' || /^\d+(\.\d+)?$/.test(String(ts))) ts = new Date(Math.round((Number(ts) - 25569) * 864e5)).toISOString();
  return {
    id: String(p.id ?? p.ID ?? ''),
    ts: new Date(ts).toISOString(),
    name: String(p.name ?? p.Name ?? '').trim(),
    email: String(p.email ?? p.Email ?? '').trim().toLowerCase(),
    type: /out/i.test(String(p.type ?? p.InOut ?? '')) ? 'out' : 'in',
    station: String(p.station ?? p.Station ?? ''),
    note: String(p.note ?? p.Note ?? ''),
    flag: String(p.flag ?? p.Flag ?? '').trim() ? 'early' : '',
  };
}

// "8:00", "08:00:00" or an Excel day fraction (0.333…) all become "08:00".
const hhmm = (v) => {
  if (typeof v === 'number' || /^0?\.\d+$/.test(String(v))) { const m = Math.round(Number(v) * 1440); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }
  const [h, m = '0'] = String(v ?? '').trim().split(':');
  return `${String(Number(h) || 0).padStart(2, '0')}:${String(Number(m) || 0).padStart(2, '0')}`;
};

export function normShift(r) {
  let date = r.date ?? r.Date ?? '';
  if (typeof date === 'number' || /^\d{5}$/.test(String(date))) date = new Date(Math.round((Number(date) - 25569) * 864e5)).toISOString();
  return {
    id: String(r.id ?? r.ID ?? ''),
    date: String(date).slice(0, 10),
    name: String(r.name ?? r.Name ?? '').trim(),
    email: String(r.email ?? r.Email ?? '').trim().toLowerCase(),
    station: String(r.station ?? r.Station ?? ''),
    start: hhmm(r.start ?? r.Start),
    end: hhmm(r.end ?? r.End),
    note: String(r.note ?? r.Note ?? ''),
  };
}

const normAll = (d) => ({
  punches: (d.punches || []).filter((p) => p.ts ?? p.Timestamp).map(normPunch),
  client: (d.client || []).map((c) => ({ week: String(c.week ?? c.Week ?? '').slice(0, 10), hours: Number(c.hours ?? c.SuccessfulHours) || 0 })),
  schedule: (d.schedule || []).map(normShift).filter((r) => r.date && r.email),
});

export const api = {
  async all() {
    if (DEMO) return demo.load();
    return normAll(await paPost(READ_URL, { action: 'all' }));
  },
  async punch(body) {
    if (DEMO) return demo.punch(body);
    const out = await paPost(WRITE_URL, { action: 'punch', ...body, deviceTs: new Date().toISOString() });
    return normPunch(out.punch);
  },
  async clientHours(week, hours) {
    if (DEMO) return demo.clientHours(week, hours);
    await paPost(WRITE_URL, { action: 'client', week, hours });
  },
  async addShift(shift) {
    if (DEMO) return demo.addShift(shift);
    const out = await paPost(WRITE_URL, { action: 'schedule_add', ...shift });
    return normShift(out.shift);
  },
  async removeShift(id) {
    if (DEMO) return demo.removeShift(id);
    await paPost(WRITE_URL, { action: 'schedule_delete', id });
  },
};

export const demo = {
  KEY: 'onsite-demo-v3',
  load() {
    let d = storage.get(this.KEY, null);
    if (!d) { d = seed(); storage.set(this.KEY, d); }
    d.schedule ||= [];
    return structuredClone(d);
  },
  punch(b) {
    const d = this.load();
    const p = normPunch({ id: crypto.randomUUID(), ts: new Date().toISOString(), ...b });
    d.punches.push(p);
    storage.set(this.KEY, d);
    return p;
  },
  clientHours(week, hours) {
    const d = this.load();
    d.client = d.client.filter((c) => c.week !== week).concat(hours == null ? [] : [{ week, hours }]);
    storage.set(this.KEY, d);
  },
  addShift(shift) {
    const d = this.load();
    const r = normShift({ id: crypto.randomUUID(), ...shift });
    d.schedule.push(r);
    storage.set(this.KEY, d);
    return r;
  },
  removeShift(id) {
    const d = this.load();
    d.schedule = d.schedule.filter((r) => r.id !== id);
    storage.set(this.KEY, d);
  },
  reset() { storage.remove(this.KEY); },
};

// Two weeks of made-up pairs, so every view has something to show in demo mode.
function seed() {
  const people = [
    ['Avery Lin', 'avery.lin@example.com'], ['Jordan Pike', 'jordan.pike@example.com'],
    ['Sam Okafor', 'sam.okafor@example.com'], ['Riley Chen', 'riley.chen@example.com'],
    ['Morgan Diaz', 'morgan.diaz@example.com'], ['Casey Novak', 'casey.novak@example.com'],
  ];
  const stations = CFG.stations.length ? CFG.stations : ['Robot 1', 'Robot 2', 'Robot 3'];
  const punches = [];
  const schedule = [];
  let seq = 1;
  const plan = (d, who, station, note = '') =>
    schedule.push({ id: `demo-s${seq++}`, date: dayKey(d), name: who[0], email: who[1], station, start: '08:00', end: `${String(8 + CFG.shiftHours).padStart(2, '0')}:00`, note });
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const push = (t, who, type, station, extra = {}) =>
    punches.push({ id: `demo-${seq++}`, ts: t.toISOString(), name: who[0], email: who[1], type, station, note: '', flag: '', ...extra });
  const now = new Date();
  const start = addDays(mondayOf(now), -7);
  const at = (d, mins) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0, 0, 0).getTime() + mins * 60000;
  // The plan runs through next Friday: three robots, two people each. Next Thursday
  // Robot 2 has only one person booked, so the Schedule tab shows an understaffed day.
  const planEnd = addDays(mondayOf(now), 11);
  for (let d = new Date(start); d <= planEnd; d = addDays(d, 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const nextThu = dayKey(d) === dayKey(addDays(mondayOf(now), 10));
    for (let pair = 0; pair < 3; pair++) {
      const station = stations[pair % stations.length];
      plan(d, people[pair * 2], station);
      if (!(nextThu && pair === 1)) plan(d, people[pair * 2 + 1], station);
    }
  }
  for (let d = new Date(start); dayKey(d) <= dayKey(now); d = addDays(d, 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const today = dayKey(d) === dayKey(now);
    for (let pair = 0; pair < 3; pair++) {
      const a = people[pair * 2], b = people[pair * 2 + 1];
      const station = stations[pair % stations.length];
      const shift = CFG.shiftHours * 60;
      const inA = new Date(at(d, Math.round(rnd() * 12 - 4)));
      const inB = new Date(at(d, Math.round(rnd() * 15 - 3)));
      const outA = new Date(at(d, shift + Math.round(rnd() * 10 - 3)));
      const early = pair === 1 && dayKey(d) === dayKey(addDays(start, 3));
      const outB = new Date(early ? at(d, 255) : at(d, shift + Math.round(rnd() * 10 - 2)));
      if (today) {
        // Today: one pair in full, one person on Robot 3 hasn't arrived.
        if (now > inA) push(inA, a, 'in', station);
        if (now > inB && pair !== 2) push(inB, b, 'in', station);
        if (now > outA) push(outA, a, 'out', station);
        if (now > outB && pair !== 2) push(outB, b, 'out', station);
        continue;
      }
      push(inA, a, 'in', station);
      push(inB, b, 'in', station);
      if (!(pair === 2 && dayKey(d) === dayKey(addDays(start, 1)))) push(outA, a, 'out', station);
      push(outB, b, 'out', station, early ? { flag: 'early', note: 'Felt unwell, told the client lead' } : {});
    }
  }
  // Two bench people who covered Robot 4 last Friday; free today, so they can backfill.
  const bench = [['Jamie Ortiz', 'jamie.ortiz@example.com'], ['Priya Raman', 'priya.raman@example.com']];
  const fri = addDays(start, 4);
  const station4 = stations[3] || stations[stations.length - 1];
  for (const [i, who] of bench.entries()) {
    plan(fri, who, station4);
    push(new Date(at(fri, i * 4)), who, 'in', station4);
    push(new Date(at(fri, CFG.shiftHours * 60 + i * 3)), who, 'out', station4);
  }
  punches.sort((x, y) => x.ts.localeCompare(y.ts));
  return { punches, client: [{ week: dayKey(start), hours: 61.5 }], schedule };
}
