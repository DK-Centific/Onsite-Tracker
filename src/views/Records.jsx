import { useMemo, useState } from 'react';
import { Download, LogIn, LogOut, Search } from 'lucide-react';
import { useStore } from '../lib/store.js';
import { buildSessions } from '../lib/hours.js';
import { dayKey, fmtHrs, fmtLongDay, fmtTime, pad, parseDay } from '../lib/time.js';
import { Group, Row, Segmented, Tag } from '../components/ui.jsx';
import { ISSUE, issueDetail } from './Today.jsx';
import { STATUS, dayPlan } from '../lib/schedule.js';

function download(name, rows) {
  const csv = rows.map((r) => r.map((c) => {
    const s = String(c ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function Records() {
  const { data } = useStore();
  const [mode, setMode] = useState(() => (location.hash.includes('flags') ? 'flags' : 'all'));
  const [q, setQ] = useState('');
  const { sessions, issues } = useMemo(() => buildSessions(data.punches), [data.punches]);
  const match = (x) => `${x.name} ${x.email} ${x.station}`.toLowerCase().includes(q.toLowerCase());

  const groups = useMemo(() => {
    const items = mode === 'flags'
      ? issues.filter(match).map((i) => ({ kind: 'issue', at: i.at, i }))
      : data.punches.filter(match).map((p) => ({ kind: 'punch', at: new Date(p.ts), p }));
    items.sort((a, b) => b.at - a.at);
    const by = new Map();
    for (const it of items.slice(0, 400)) {
      const k = dayKey(it.at);
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(it);
    }
    return [...by];
  }, [data.punches, issues, mode, q]);

  const exportLog = () => {
    const rows = [['Date', 'Time', 'Name', 'Email', 'In/Out', 'Robot / station', 'Note', 'Flag', 'Timestamp (UTC)']];
    for (const p of [...data.punches].sort((a, b) => a.ts.localeCompare(b.ts))) {
      const t = new Date(p.ts);
      rows.push([dayKey(t), hhmm(t), p.name, p.email, p.type.toUpperCase(), p.station, p.note, p.flag ? 'Left early' : '', p.ts]);
    }
    download(`onsite-checkins-${dayKey(new Date())}.csv`, rows);
  };
  const exportShifts = () => {
    const rows = [['Date', 'Name', 'Email', 'Robot / station', 'In', 'Out', 'Person hours', 'Left early', 'Note']];
    for (const s of [...sessions].filter((x) => !x.live).sort((a, b) => a.start - b.start)) {
      rows.push([s.day, s.name, s.email, s.station, hhmm(s.start), hhmm(s.end), s.hours.toFixed(2), s.early ? 'Yes' : '', s.note || '']);
    }
    download(`onsite-shifts-${dayKey(new Date())}.csv`, rows);
  };
  const exportPlan = () => {
    const rows = [['Date', 'Name', 'Email', 'Robot / station', 'Scheduled start', 'Scheduled end', 'Status', 'Actual in', 'Actual out', 'Person hours', 'Note']];
    const dates = [...new Set((data.schedule || []).map((r) => r.date))].sort();
    for (const k of dates) {
      for (const r of dayPlan(data.schedule, sessions, issues, parseDay(k)).rows) {
        const worked = r.sessions.reduce((a, x) => a + x.hours, 0);
        const first = r.sessions[0];
        const last = r.sessions[r.sessions.length - 1];
        rows.push([r.date, r.name, r.email, r.station, r.start, r.end, STATUS[r.status].label, first ? hhmm(first.start) : '', last && !last.live ? hhmm(last.end) : '', worked ? worked.toFixed(2) : '', r.note]);
      }
    }
    download(`onsite-schedule-vs-actual-${dayKey(new Date())}.csv`, rows);
  };

  return (
    <div className="view view-enter">
      <header className="page-head">
        <div>
          <h1 className="large-title">Records</h1>
          <p className="lede">Every check-in, with server time. Export to compare with the client's badge records.</p>
        </div>
      </header>

      <div className="toolbar">
        <Segmented
          label="Show"
          value={mode}
          onChange={setMode}
          options={[{ value: 'all', label: 'All check-ins' }, { value: 'flags', label: `Flags${issues.length ? ` (${issues.length})` : ''}` }]}
        />
        <label className="search search-inline">
          <Search size={16} aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email or robot" aria-label="Search records" />
        </label>
      </div>

      <Group title="Export" className="export-group">
        <Row leading={<span className="row-icon"><Download size={18} /></span>} title="Check-in log" subtitle="One row per tap, same columns as the Excel sheet" trailing="CSV" onClick={exportLog} />
        <Row leading={<span className="row-icon"><Download size={18} /></span>} title="Shifts" subtitle="In, out and hours per person per day, for badge reconciliation" trailing="CSV" onClick={exportShifts} />
        <Row leading={<span className="row-icon"><Download size={18} /></span>} title="Schedule vs actual" subtitle="Every scheduled shift with its status (worked, no-show) and actual in/out" trailing="CSV" onClick={exportPlan} />
      </Group>

      {groups.length === 0 && (
        <Group><div className="empty-row">{q ? `Nothing matches “${q}”.` : mode === 'flags' ? 'No flags. Early or missed check-outs show up here.' : 'No check-ins yet.'}</div></Group>
      )}
      {groups.map(([k, items]) => (
        <Group key={k} title={fmtLongDay(parseDay(k))}>
          {items.map((it) => it.kind === 'punch' ? (
            <Row
              key={it.p.id}
              leading={<span className={`row-icon icon-${it.p.type}`}>{it.p.type === 'in' ? <LogIn size={16} /> : <LogOut size={16} />}</span>}
              title={<>{it.p.name}{it.p.flag && <Tag tone="bad">Left early</Tag>}</>}
              subtitle={`${it.p.type === 'in' ? 'In' : 'Out'} · ${it.p.station}${it.p.note ? ` · “${it.p.note}”` : ''}`}
              trailing={<span className="mono-num">{fmtTime(it.at)}</span>}
            />
          ) : (
            <Row
              key={`${it.i.kind}${it.i.email}${+it.at}`}
              leading={<span className={`row-icon icon-${ISSUE[it.i.kind].tone}`}>{ISSUE[it.i.kind].icon}</span>}
              title={<>{it.i.name} <Tag tone={ISSUE[it.i.kind].tone}>{ISSUE[it.i.kind].label}</Tag></>}
              subtitle={`${it.i.station} · ${issueDetail(it.i)}`}
              trailing={it.i.hours != null ? <span className="mono-num">{fmtHrs(it.i.hours)} h</span> : null}
            />
          ))}
        </Group>
      ))}
    </div>
  );
}
