import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { Check, ChevronRight, Search, Tablet, UserPlus } from 'lucide-react';
import { useStore } from '../lib/store.js';
import { CFG } from '../lib/config.js';
import { roster, statusOf, buildSessions } from '../lib/hours.js';
import { addDays, firstName, fmtHrs, fmtLongDay, fmtTime, greeting, hoursBetween, dayKey, mondayOf } from '../lib/time.js';
import { useNow } from '../lib/hooks.js';
import { Avatar, Group, Num, Row, Sheet, Tag } from '../components/ui.jsx';
import { ShiftRing } from '../components/ShiftRing.jsx';
import { RobotLanes } from '../components/RobotLanes.jsx';

const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

export function CheckIn() {
  const { me, device, data } = useStore();
  const [who, setWho] = useState(null); // shared device: the person at the screen right now
  const [done, setDone] = useState(null);
  const [station, setStation] = useState(''); // robot picked but not checked in yet, for the side lane
  const shared = device === 'shared';

  // A shared device returns to "Who's checking in?" after each tap.
  useEffect(() => {
    if (!done || !shared) return undefined;
    const id = setTimeout(() => { setDone(null); setWho(null); }, 6000);
    return () => clearTimeout(id);
  }, [done, shared]);

  // A name picked on the shared tablet and walked away from clears after 20s idle,
  // so the next person never sees someone else's Check out button.
  useEffect(() => {
    if (!shared || !who || done) return undefined;
    let id;
    const arm = () => { clearTimeout(id); id = setTimeout(() => setWho(null), 20000); };
    arm();
    addEventListener('pointerdown', arm);
    addEventListener('keydown', arm);
    return () => { clearTimeout(id); removeEventListener('pointerdown', arm); removeEventListener('keydown', arm); };
  }, [shared, who, done]);

  if (!data) return <div className="view"><div className="skeleton tall" /></div>;

  let primary;
  let person = null;
  if (shared) {
    if (done) primary = <Done done={done} onNext={() => { setDone(null); setWho(null); }} shared />;
    else if (!who) primary = <WhoIsHere onPick={setWho} />;
    else { person = who; primary = <Person person={who} onDone={setDone} onSwitch={() => setWho(null)} onStation={setStation} shared />; }
  } else if (!me) {
    primary = <Welcome />;
  } else {
    person = me;
    primary = done && done.type === 'out'
      ? <Done done={done} onNext={() => setDone(null)} />
      : <Person person={me} onDone={setDone} onStation={setStation} />;
  }

  return (
    <div className={clsx('checkin-layout', shared && 'is-shared')}>
      <div className="checkin-primary">{primary}</div>
      <CheckinAside person={person} picked={station} />
    </div>
  );
}

// Desktop only: the person's robot lane today and their week, or who's on site.
function CheckinAside({ person, picked }) {
  const { data } = useStore();
  const now = useNow(30000);
  const { sessions } = useMemo(() => buildSessions(data.punches, now), [data.punches, now]);
  const today = dayKey(now);
  const stations = CFG.stations.length ? CFG.stations : ['Robot 1'];
  const st = person ? statusOf(data.punches, person.email, now) : null;
  const robot = st?.open?.station || picked;
  const wk0 = mondayOf(now);
  const days = [...Array(7)].map((_, i) => addDays(wk0, i)).filter((d) => d.getDay() !== 0 && d.getDay() !== 6);
  const mine = person ? sessions.filter((s) => s.email === person.email && s.day >= dayKey(wk0)) : [];
  const weekTotal = mine.reduce((a, s) => a + s.hours, 0);
  const live = sessions.filter((s) => s.live);

  return (
    <aside className="checkin-aside" aria-label="Today at the site">
      {robot ? (
        <Group title={`${robot} today`} className="aside-lane" footer="Your time joins your robot's lane. Time you and your partner work together counts once.">
          <RobotLanes day={now} sessions={sessions.filter((s) => s.day === today && s.station === robot)} stations={[robot]} now={now} />
        </Group>
      ) : (
        <Group title="Robots right now">
          {stations.map((s) => {
            const on = live.filter((l) => l.station === s);
            return (
              <Row
                key={s}
                title={s}
                subtitle={on.length ? on.map((p) => `${p.name} since ${fmtTime(p.start)}`).join(' · ') : 'Free'}
                trailing={on.length ? <span className="avatars">{on.map((p) => <Avatar key={p.email} name={p.name} tone="on" />)}</span> : null}
              />
            );
          })}
        </Group>
      )}
      {person && (
        <Group title="Your week" action={<span className="group-aside"><Num value={weekTotal} format={(v) => `${fmtHrs(v)} h`} /></span>}>
          {days.map((d) => {
            const h = mine.filter((s) => s.day === dayKey(d)).reduce((a, s) => a + s.hours, 0);
            const isToday = dayKey(d) === today;
            return (
              <Row
                key={+d}
                title={isToday ? 'Today' : d.toLocaleDateString([], { weekday: 'long' })}
                subtitle={d.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                trailing={<span className={clsx('mono-num', !h && 'muted')}>{h ? `${fmtHrs(h)} h` : d > now ? '' : '–'}</span>}
              />
            );
          })}
        </Group>
      )}
    </aside>
  );
}

function Welcome() {
  const { setMe, setDevice } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Add your full name.');
    if (!validEmail(email.trim())) return setErr('Add a valid email.');
    setMe({ name: name.trim(), email: email.trim().toLowerCase(), station: '' });
    setDevice('personal');
  };
  return (
    <div className="view view-narrow view-enter">
      <h1 className="large-title">Welcome</h1>
      <p className="lede">Tell us who you are once. This phone remembers you, so checking in takes one tap.</p>
      <form onSubmit={submit} noValidate>
        <Group footer={err ? <span className="err" role="alert">{err}</span> : 'Use the email you were staffed with.'}>
          <label className="field-row">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" aria-invalid={!!err && !name.trim()} />
          </label>
          <label className="field-row">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" placeholder="name@company.com" aria-invalid={!!err && !validEmail(email.trim())} />
          </label>
        </Group>
        <button type="submit" className="btn btn-primary btn-block">Continue</button>
      </form>
      <Group className="mt">
        <Row
          leading={<span className="row-icon"><Tablet size={18} /></span>}
          title="Set up as a shared tablet"
          subtitle="For a device at the site entrance. Everyone picks their name each time."
          trailing={<ChevronRight size={18} />}
          onClick={() => setDevice('shared')}
        />
      </Group>
    </div>
  );
}

function WhoIsHere({ onPick }) {
  const { data } = useStore();
  const now = useNow(30000);
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const people = useMemo(() => roster(data.punches), [data.punches]);
  const shown = people.filter((p) => `${p.name} ${p.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="view view-narrow view-enter">
      <p className="kiosk-clock">{fmtTime(now)}<span>{fmtLongDay(now)}</span></p>
      <h1 className="large-title">Who's checking in?</h1>
      <label className="search">
        <Search size={18} aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find your name" aria-label="Find your name" />
      </label>
      <Group>
        {shown.map((p, i) => {
          const st = statusOf(data.punches, p.email, now);
          return (
            <Row
              key={p.email}
              className="row-in"
              style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
              leading={<Avatar name={p.name} tone={st.open ? 'on' : undefined} />}
              title={p.name}
              subtitle={st.open ? `On site since ${fmtTime(new Date(st.open.ts))} · ${st.open.station}` : 'Not checked in today'}
              trailing={<ChevronRight size={18} />}
              onClick={() => onPick(p)}
            />
          );
        })}
        {shown.length === 0 && q && <div className="empty-row">No one called “{q}” yet.</div>}
        <Row leading={<span className="row-icon"><UserPlus size={18} /></span>} title="I'm new here" onClick={() => setAdding(true)} />
      </Group>
      <NewPersonSheet open={adding} onOpenChange={setAdding} onDone={(p) => { setAdding(false); onPick(p); }} initialName={q} />
    </div>
  );
}

function NewPersonSheet({ open, onOpenChange, onDone, initialName }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { if (open) { setName(initialName || ''); setEmail(''); setErr(''); } }, [open, initialName]);
  const submit = (e) => {
    e?.preventDefault();
    if (!name.trim()) return setErr('Add your full name.');
    if (!validEmail(email.trim())) return setErr('Add a valid email.');
    onDone({ name: name.trim(), email: email.trim().toLowerCase() });
  };
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="New here"
      description="Add your name and the email you were staffed with."
      footer={<button type="button" className="btn btn-primary btn-block" onClick={submit}>Continue</button>}
    >
      <form onSubmit={submit} noValidate>
        <Group footer={err && <span className="err" role="alert">{err}</span>}>
          <label className="field-row"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="off" /></label>
          <label className="field-row"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" placeholder="name@company.com" autoComplete="off" /></label>
        </Group>
      </form>
    </Sheet>
  );
}

function Person({ person, onDone, onSwitch, onStation, shared }) {
  const { data, me, setMe, forgetMe, punch } = useStore();
  const now = useNow(1000);
  const st = statusOf(data.punches, person.email, now);
  const { sessions } = useMemo(() => buildSessions(data.punches, now), [data.punches, now]);
  const live = sessions.filter((s) => s.live);
  const stations = CFG.stations.length ? CFG.stations : ['Robot 1'];
  const [station, setStation] = useState(() => (!shared && me?.station) || '');
  const [busy, setBusy] = useState(false);
  const [askReason, setAskReason] = useState(false);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');
  const reasonRef = useRef(null);
  useEffect(() => { onStation?.(station); }, [station, onStation]);

  const open = st.open;
  const elapsed = open ? hoursBetween(new Date(open.ts), now) : 0;
  const early = open && elapsed < CFG.shiftHours - CFG.earlyGraceMinutes / 60;
  const partners = open ? live.filter((s) => s.station === open.station && s.email !== person.email) : [];

  async function doPunch(type, extra = {}) {
    setBusy(true);
    setErr('');
    try {
      const p = await punch({ type, name: person.name, email: person.email, station: type === 'in' ? station : open?.station || station, ...extra });
      if (!shared) setMe({ ...me, station: p.station });
      const t = new Date(p.ts);
      const todays = sessions.filter((s) => s.email === person.email && s.day === dayKey(now));
      const hrs = type === 'out' ? todays.reduce((a, s) => a + s.hours, 0) : 0;
      toast.success(type === 'in' ? `Checked in at ${fmtTime(t)}` : `Checked out at ${fmtTime(t)}`, {
        description: type === 'out' && extra.flag ? 'Your leads have been told.' : undefined,
      });
      onDone({ type, at: t, station: p.station, name: person.name, hours: hrs, early: !!extra.flag });
      setAskReason(false);
      setReason('');
    } catch (e) {
      setErr(`Didn't save: ${e.message}. Try again, or tell your lead the time.`);
      toast.error("That didn't save", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  const checkOut = () => (early ? setAskReason(true) : doPunch('out'));

  if (open) {
    return (
      <div className="view view-narrow view-enter center-col">
        <h1 className="large-title">{shared ? person.name : `${greeting(now)}, ${firstName(person.name)}`}</h1>
        <p className="lede">Checked in at {fmtTime(new Date(open.ts))}</p>
        <ShiftRing hours={elapsed} shiftHours={CFG.shiftHours}>
          <span className="ring-station">{open.station}</span>
        </ShiftRing>
        <p className="partner">
          {partners.length ? <>With {partners.map((p) => p.name).join(' and ')}</> : 'No partner checked in yet'}
        </p>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="dock">
          <button type="button" className="btn btn-primary btn-block btn-lg" onClick={checkOut} disabled={busy} aria-busy={busy}>
            {busy ? 'Saving…' : 'Check out'}
          </button>
          <SwitchLink shared={shared} name={person.name} onSwitch={onSwitch} forget={forgetMe} />
        </div>
        <Sheet
          open={askReason}
          onOpenChange={setAskReason}
          title="Leaving early?"
          description={`You've been on site ${fmtHrs(elapsed)} h of a ${CFG.shiftHours} h shift. Your leads will be told, so let them know why.`}
          footer={
            <button
              type="button"
              className="btn btn-danger btn-block"
              disabled={busy || !reason.trim()}
              onClick={() => doPunch('out', { flag: 'early', note: reason.trim() })}
            >
              {busy ? 'Saving…' : 'Check out early'}
            </button>
          }
        >
          <textarea
            ref={reasonRef}
            className="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="For example: unwell, told Kate at 1:10 PM"
            aria-label="Reason for leaving early"
            autoFocus
          />
        </Sheet>
      </div>
    );
  }

  return (
    <div className="view view-narrow view-enter">
      <h1 className="large-title">{shared ? person.name : `${greeting(now)}, ${firstName(person.name)}`}</h1>
      <p className="lede">{fmtLongDay(now)} · {fmtTime(now)}</p>
      <section className="robot-section">
        <div className="group-head"><h2 className="group-title">Your robot</h2></div>
        <div className="robots" role="radiogroup" aria-label="Robot">
          {stations.map((s) => {
            const on = live.filter((l) => l.station === s);
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={station === s}
                className={clsx('robot', station === s && 'is-on')}
                onClick={() => setStation(s)}
              >
                <span className="robot-name">{s}</span>
                <span className="robot-who">
                  {on.length ? (
                    <>
                      <span className="avatars">{on.map((p) => <Avatar key={p.email} name={p.name} />)}</span>
                      {on.length === 1 ? firstName(on[0].name) : `${on.length} on site`}
                    </>
                  ) : 'Free'}
                </span>
                {station === s && <span className="robot-check"><Check size={14} strokeWidth={3} /></span>}
              </button>
            );
          })}
        </div>
      </section>
      {st.last && <p className="hint">Last {st.last.type === 'in' ? 'checked in' : 'checked out'} {new Date(st.last.ts).toDateString() === now.toDateString() ? 'today' : new Date(st.last.ts).toLocaleDateString([], { weekday: 'long' })} at {fmtTime(new Date(st.last.ts))}</p>}
      {err && <p className="err" role="alert">{err}</p>}
      <div className="dock">
        <button type="button" className="btn btn-primary btn-block btn-lg" disabled={!station || busy} aria-busy={busy} onClick={() => doPunch('in')}>
          {busy ? 'Saving…' : station ? `Check in to ${station}` : 'Choose your robot'}
        </button>
        <SwitchLink shared={shared} name={person.name} onSwitch={onSwitch} forget={forgetMe} />
      </div>
    </div>
  );
}

function SwitchLink({ shared, name, onSwitch, forget }) {
  return (
    <button type="button" className="link-quiet" onClick={shared ? onSwitch : forget}>
      Not {firstName(name)}?
    </button>
  );
}

function Done({ done, onNext, shared }) {
  return (
    <div className="view view-narrow view-enter center-col done">
      <span className={clsx('done-mark', done.early && 'is-early')}><Check size={44} strokeWidth={2.5} /></span>
      <h1 className="large-title">{done.type === 'in' ? 'Checked in' : 'Checked out'}</h1>
      <p className="done-time">{fmtTime(done.at)}</p>
      <p className="lede">
        {done.name} · {done.station}
        {done.type === 'out' && done.hours > 0 ? ` · ${fmtHrs(done.hours)} h today` : ''}
      </p>
      {done.early && <Tag tone="bad">Left early · leads notified</Tag>}
      <div className="dock">
        <button type="button" className="btn btn-plain btn-block" onClick={onNext}>
          {shared ? 'Next person' : 'Done'}
        </button>
      </div>
    </div>
  );
}
