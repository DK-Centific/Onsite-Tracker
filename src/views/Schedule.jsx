import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../lib/store.js';
import { CFG } from '../lib/config.js';
import { buildSessions } from '../lib/hours.js';
import { addDays, dayKey, firstName, fmtHrs, fmtLongDay, fmtTime, mondayOf, weekLabel } from '../lib/time.js';
import { useNow } from '../lib/hooks.js';
import { Avatar, Group, Row, Sheet, Tag } from '../components/ui.jsx';
import { ShiftSheet } from '../components/ShiftSheet.jsx';
import { STATUS, backfillStart, backfills, coverage, dayPlan, shiftHours } from '../lib/schedule.js';

const PAIR = 2;

export function Schedule() {
  const { data } = useStore();
  const now = useNow(60000);
  const [wk0, setWk0] = useState(() => mondayOf(new Date()));
  const thisWeek = dayKey(mondayOf(now)) === dayKey(wk0);
  const schedule = data.schedule || [];
  const stations = CFG.stations.length ? CFG.stations : [...new Set(schedule.map((r) => r.station))];
  const { sessions, issues } = useMemo(() => buildSessions(data.punches, now), [data.punches, now]);
  const [adding, setAdding] = useState(null); // initial values for the add sheet
  const [open, setOpen] = useState(null); // { k, station } for the robot-day sheet

  // Weekdays always; a weekend day only when something is booked on it.
  const days = [...Array(7)].map((_, i) => addDays(wk0, i))
    .filter((d) => (d.getDay() !== 0 && d.getDay() !== 6) || schedule.some((r) => r.date === dayKey(d)));
  const plans = useMemo(() => new Map(days.map((d) => [dayKey(d), dayPlan(schedule, sessions, issues, d, now)])), [schedule, sessions, issues, dayKey(wk0), now]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekRows = days.flatMap((d) => plans.get(dayKey(d)).rows);
  const booked = weekRows.reduce((a, r) => a + shiftHours(r), 0);
  const short = days.flatMap((d) => stations.filter((s) => coverage(schedule, dayKey(d), s, PAIR).short).map((s) => `${s} ${d.toLocaleDateString([], { weekday: 'short' })}`));
  const missing = weekRows.filter((r) => r.status === 'late' || r.status === 'noshow').length;

  return (
    <div className="view view-enter">
      <header className="page-head">
        <div>
          <h1 className="large-title">Schedule</h1>
          <p className="lede">Week of {weekLabel(wk0)}</p>
        </div>
        <div className="stepper" role="group" aria-label="Week">
          <button type="button" className="icon-btn" aria-label="Previous week" onClick={() => setWk0(addDays(wk0, -7))}><ChevronLeft size={18} /></button>
          <button type="button" className="btn btn-plain btn-sm" disabled={thisWeek} onClick={() => setWk0(mondayOf(new Date()))}>This week</button>
          <button type="button" className="icon-btn" aria-label="Next week" onClick={() => setWk0(addDays(wk0, 7))}><ChevronRight size={18} /></button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding({ date: dayKey(thisWeek ? now : wk0) })}><Plus size={16} /> Add shift</button>
        </div>
      </header>

      <Group footer="Shifts come from the Schedule sheet in Excel; you can add them here or type them there. Times are site-local.">
        <div className="week-sum">
          <span><strong>{weekRows.length}</strong> shifts</span>
          <span><strong>{fmtHrs(booked)} h</strong> booked</span>
          <span>{short.length ? <><strong>{short.length}</strong> understaffed: {short.join(', ')}</> : 'Every running robot has a full pair'}</span>
          {missing > 0 && <span><strong>{missing}</strong> missing</span>}
        </div>
      </Group>

      {days.map((d) => {
        const k = dayKey(d);
        const plan = plans.get(k);
        const isToday = k === dayKey(now);
        const running = stations.filter((s) => plan.rows.some((r) => r.station === s));
        return (
          <Group
            key={k}
            className="day-group"
            title={`${isToday ? 'Today · ' : ''}${fmtLongDay(d)}`}
            action={<button type="button" className="link" onClick={() => setAdding({ date: k })}>Add</button>}
          >
            {running.length === 0 && <div className="empty-row">Nothing booked.</div>}
            {running.map((s) => {
              const rows = plan.rows.filter((r) => r.station === s);
              const cov = coverage(schedule, k, s, PAIR);
              const late = backfills(rows, PAIR).length;
              return (
                <Row
                  key={s}
                  className="robot-row"
                  onClick={() => setOpen({ k, station: s })}
                  title={<>
                    {s}
                    {late > 0 && <Tag tone="warn">Needs a backfill</Tag>}
                    {cov.short && <Tag tone="warn">{cov.count} of {PAIR} booked</Tag>}
                  </>}
                  subtitle={
                    <span className="chips">
                      {rows.map((r) => (
                        <span key={r.id} className="chip-person" data-status={r.status}>
                          <Avatar name={r.name} />
                          {firstName(r.name)}
                          <span className="chip-time">{fmtTime(r.startAt)}–{fmtTime(r.endAt)}</span>
                          {(r.status === 'late' || r.status === 'noshow') && <span className="sr-only">{STATUS[r.status].label}</span>}
                        </span>
                      ))}
                    </span>
                  }
                />
              );
            })}
            {plan.unscheduled.length > 0 && (
              <Row
                title={<span className="row-sub">Checked in without a shift</span>}
                subtitle={<span className="chips">{plan.unscheduled.map((u) => (
                  <span key={u.email} className="chip-person"><Avatar name={u.name} />{firstName(u.name)}<span className="chip-time">{u.station} · {fmtTime(u.start)}</span></span>
                ))}</span>}
              />
            )}
          </Group>
        );
      })}

      <RobotDaySheet
        value={open}
        onClose={() => setOpen(null)}
        plan={open ? plans.get(open.k) : null}
        onAdd={(init) => { setOpen(null); setAdding(init); }}
        now={now}
      />
      <ShiftSheet
        open={!!adding}
        onOpenChange={(o) => !o && setAdding(null)}
        initial={adding}
        backfill={adding?.backfill}
      />
    </div>
  );
}

// One robot on one day: its shifts with their status, remove, and add or backfill.
function RobotDaySheet({ value, onClose, plan, onAdd, now }) {
  const { removeShift } = useStore();
  const rows = value && plan ? plan.rows.filter((r) => r.station === value.station) : [];
  const late = backfills(rows, PAIR)[0]?.missing[0];
  const remove = async (r) => {
    try {
      await removeShift(r.id);
      toast(`Removed ${r.name}'s shift`, { description: `${value.station} · ${fmtTime(r.startAt)}–${fmtTime(r.endAt)}` });
    } catch (e) {
      toast.error("Couldn't remove the shift", { description: e.message });
    }
  };
  return (
    <Sheet
      open={!!value}
      onOpenChange={(o) => !o && onClose()}
      title={value?.station || ''}
      description={value ? fmtLongDay(new Date(`${value.k}T12:00:00`)) : ''}
      footer={
        late
          ? <button type="button" className="btn btn-primary btn-block" onClick={() => onAdd({ date: late.date, station: late.station, start: backfillStart(late, now), end: late.end, note: `Backfill for ${late.name}`, backfill: late.name })}>Backfill for {firstName(late.name)}</button>
          : <button type="button" className="btn btn-plain btn-block" onClick={() => onAdd({ date: value?.k, station: value?.station })}>Add someone</button>
      }
    >
      <Group>
        {rows.map((r) => (
          <Row
            key={r.id}
            className="shift-row"
            leading={<Avatar name={r.name} tone={STATUS[r.status].tone} />}
            title={<>{r.name} {r.status !== 'upcoming' && <Tag tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Tag>}</>}
            subtitle={`${fmtTime(r.startAt)}–${fmtTime(r.endAt)}${r.note ? ` · ${r.note}` : ''}${r.elsewhere ? ` · checked in on ${r.elsewhere}` : ''}`}
            trailing={<button type="button" className="link" onClick={() => remove(r)}>Remove</button>}
          />
        ))}
        {rows.length === 0 && <div className="empty-row">No shifts left on this robot.</div>}
      </Group>
    </Sheet>
  );
}
