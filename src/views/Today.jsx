import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ClockAlert, LogOut, TriangleAlert } from 'lucide-react';
import { useStore } from '../lib/store.js';
import { CFG } from '../lib/config.js';
import { buildSessions, union } from '../lib/hours.js';
import { addDays, dayKey, fmtDay, fmtHrs, fmtLongDay, fmtTime, hoursBetween } from '../lib/time.js';
import { go, useNow } from '../lib/hooks.js';
import { Avatar, Group, Num, Row, Tag } from '../components/ui.jsx';
import { RobotLanes } from '../components/RobotLanes.jsx';

export const ISSUE = {
  early: { label: 'Left early', tone: 'bad', icon: <LogOut size={12} /> },
  noout: { label: 'No check-out', tone: 'warn', icon: <ClockAlert size={12} /> },
  noin: { label: 'No check-in', tone: 'warn', icon: <TriangleAlert size={12} /> },
};

export function issueDetail(i) {
  if (i.kind === 'early') return `Out at ${fmtTime(i.at)} after ${fmtHrs(i.hours)} h${i.note ? ` · “${i.note}”` : ''}`;
  if (i.kind === 'noout') return `In at ${fmtTime(i.at)}, never checked out · hours not counted`;
  return `Out at ${fmtTime(i.at)} with no check-in`;
}

export function Today() {
  const { data } = useStore();
  const now = useNow(30000);
  const [offset, setOffset] = useState(0);
  const day = addDays(now, offset);
  const k = dayKey(day);
  const isToday = offset === 0;

  const { sessions, issues } = useMemo(() => buildSessions(data.punches, now), [data.punches, now]);
  const daySessions = sessions.filter((s) => s.day === k);
  const live = sessions.filter((s) => s.live);
  const stations = CFG.stations.length ? CFG.stations : [...new Set(sessions.map((s) => s.station))];
  const deliveredDay = useMemo(() => {
    const by = new Map();
    for (const s of daySessions) { if (!by.has(s.station)) by.set(s.station, []); by.get(s.station).push(s); }
    let t = 0;
    for (const list of by.values()) for (const [a, b] of union(list)) t += (b - a) / 36e5;
    return t;
  }, [daySessions]);
  const running = new Set(live.map((s) => s.station)).size;
  const recentIssues = issues.filter((i) => (isToday ? now - i.at < 7 * 864e5 : dayKey(i.at) === k));

  return (
    <div className="view view-enter">
      <header className="page-head">
        <div>
          <h1 className="large-title">{isToday ? 'Today' : fmtDay(day)}</h1>
          <p className="lede">
            {isToday
              ? live.length
                ? `${live.length} on site · ${running} of ${stations.length} robots running`
                : 'No one is on site right now'
              : fmtLongDay(day)}
          </p>
        </div>
        <div className="stepper" role="group" aria-label="Day">
          <button type="button" className="icon-btn" aria-label="Previous day" onClick={() => setOffset((o) => o - 1)}><ChevronLeft size={18} /></button>
          <button type="button" className="btn btn-plain btn-sm" disabled={isToday} onClick={() => setOffset(0)}>Today</button>
          <button type="button" className="icon-btn" aria-label="Next day" disabled={isToday} onClick={() => setOffset((o) => o + 1)}><ChevronRight size={18} /></button>
        </div>
      </header>

      <Group
        title="Robots"
        action={<span className="group-aside"><Num value={deliveredDay} format={(v) => `${fmtHrs(v)} h`} /> delivered</span>}
        footer="Thin lines are each person's time. The bar beneath is the robot's delivered time, so two people working together count once."
      >
        <RobotLanes day={day} sessions={daySessions} stations={stations} now={now} pairSize={2} />
      </Group>

      <div className="split">
        <Group
          title="Needs attention"
          action={recentIssues.length > 0 && <button type="button" className="link" onClick={() => go('admin/records?flags')}>See all</button>}
        >
          {recentIssues.length ? recentIssues.slice(0, 6).map((i, n) => (
            <Row
              key={`${i.kind}-${i.email}-${+i.at}`}
              className="row-in"
              style={{ animationDelay: `${n * 30}ms` }}
              leading={<Avatar name={i.name} tone={ISSUE[i.kind].tone} />}
              title={<>{i.name} <Tag tone={ISSUE[i.kind].tone} icon={ISSUE[i.kind].icon}>{ISSUE[i.kind].label}</Tag></>}
              subtitle={`${fmtDay(i.at)} · ${i.station} · ${issueDetail(i)}`}
            />
          )) : <div className="empty-row">{isToday ? 'Nothing in the last 7 days. Early check-outs and missed check-outs land here.' : 'Nothing on this day.'}</div>}
        </Group>
        {isToday && (
          <Group title="On site">
            {live.length ? live.sort((a, b) => a.start - b.start).map((s, i) => (
              <Row
                key={s.email}
                className="row-in"
                style={{ animationDelay: `${i * 30}ms` }}
                leading={<Avatar name={s.name} tone="on" />}
                title={s.name}
                subtitle={`${s.station} · since ${fmtTime(s.start)}`}
                trailing={<span className="mono-num">{fmtHrs(hoursBetween(s.start, now))} h</span>}
              />
            )) : <div className="empty-row">Check-ins show up here as people arrive.</div>}
          </Group>
        )}
      </div>
    </div>
  );
}
