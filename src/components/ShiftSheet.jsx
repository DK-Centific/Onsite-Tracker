import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../lib/store.js';
import { CFG } from '../lib/config.js';
import { claimName, knownPeople } from '../lib/onboarding.js';
import { fmtDay, fmtTime, parseDay } from '../lib/time.js';
import { shiftTimes } from '../lib/schedule.js';
import { Group, Sheet } from './ui.jsx';

const NEW = '__new__';
const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

// Add a shift to the schedule. With `backfill` set, it's a replacement for someone
// who isn't here: same robot and end time, starting now, and the people already
// booked that day are left out of the picker.
export function ShiftSheet({ open, onOpenChange, initial, backfill }) {
  const { data, addShift } = useStore();
  const stations = CFG.stations.length ? CFG.stations : ['Robot 1'];
  const people = useMemo(() => knownPeople(data), [data]);
  const [f, setF] = useState({});
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  useEffect(() => {
    if (!open) return;
    setErr('');
    setNote('');
    setF({ date: initial?.date || '', station: initial?.station || stations[0], start: initial?.start || '08:00', end: initial?.end || `${String(8 + CFG.shiftHours).padStart(2, '0')}:00`, who: '', name: '', email: '', note: initial?.note || '' });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const booked = new Set((data.schedule || []).filter((r) => r.date === f.date).map((r) => r.email));
  const choices = people.filter((p) => !booked.has(p.email));

  const save = async () => {
    let person = f.who === NEW ? { name: f.name.trim(), email: f.email.trim().toLowerCase() } : people.find((p) => p.email === f.who);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date || '')) return setErr('Pick a date.');
    if (!person || !person.name) return setErr('Pick an operator.');
    if (!validEmail(person.email)) return setErr('Add a valid email.');
    if (f.who === NEW) {
      // Same rule as onboarding: a taken name gets the next number, confirmed first.
      const c = claimName(person.name, person.email, people);
      if (c.renamed) { setF((x) => ({ ...x, name: c.name })); setErr(''); return setNote(`There's already a ${c.takenBy}, so this operator will show as ${c.name}. Save again to confirm, or change the name.`); }
      person = { name: c.name, email: c.email };
    }
    if (!f.start || !f.end) return setErr('Add a start and end time.');
    setBusy(true);
    setErr('');
    try {
      await addShift({ date: f.date, name: person.name, email: person.email, station: f.station, start: f.start, end: f.end, note: f.note.trim() });
      toast.success(backfill ? `${person.name} is covering ${f.station}` : `Shift added for ${person.name}`, { description: `${fmtDay(parseDay(f.date))} · ${fmtTime(shiftTimes({ date: f.date, start: f.start, end: f.end }).start)}–${fmtTime(shiftTimes({ date: f.date, start: f.start, end: f.end }).end)}` });
      onOpenChange(false);
    } catch (e) {
      setErr(`Didn't save: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={backfill ? `Backfill ${initial?.station || ''}` : 'Add a shift'}
      description={backfill ? `Covering for ${backfill}. Pick someone who isn't booked that day.` : 'Shifts are site-local times.'}
      footer={<button type="button" className="btn btn-primary btn-block" onClick={save} disabled={busy} aria-busy={busy}>{busy ? 'Saving…' : backfill ? 'Assign backfill' : 'Add shift'}</button>}
    >
      <Group footer={err ? <span className="err" role="alert">{err}</span> : note ? <span role="status">{note}</span> : undefined}>
        <label className="field-row">
          <span>Operator</span>
          <select value={f.who || ''} onChange={set('who')} className="field-select">
            <option value="" disabled>Choose…</option>
            {choices.map((p) => <option key={p.email} value={p.email}>{p.name}</option>)}
            <option value={NEW}>Someone new…</option>
          </select>
        </label>
        {f.who === NEW && (
          <>
            <label className="field-row"><span>Name</span><input value={f.name} onChange={(e) => { set('name')(e); setNote(''); }} placeholder="Full name" autoComplete="off" /></label>
            <label className="field-row"><span>Email</span><input value={f.email} onChange={set('email')} type="email" inputMode="email" placeholder="name@company.com" autoComplete="off" /></label>
          </>
        )}
        <label className="field-row"><span>Date</span><input type="date" value={f.date || ''} onChange={set('date')} disabled={!!backfill} /></label>
        <label className="field-row">
          <span>Robot</span>
          <select value={f.station || ''} onChange={set('station')} className="field-select" disabled={!!backfill}>
            {stations.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="field-row"><span>Start</span><input type="time" value={f.start || ''} onChange={set('start')} step="900" /></label>
        <label className="field-row"><span>End</span><input type="time" value={f.end || ''} onChange={set('end')} step="900" /></label>
        <label className="field-row"><span>Note</span><input value={f.note || ''} onChange={set('note')} placeholder="Optional" /></label>
      </Group>
    </Sheet>
  );
}
