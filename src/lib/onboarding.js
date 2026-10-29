import { roster } from './hours.js';

// Everyone the app knows: people who have checked in, plus people on the schedule.
export function knownPeople(data) {
  const scheduled = (data.schedule || []).map((r) => ({ ...r, ts: `${r.date}T00:00:00Z` }));
  return roster((data.punches || []).concat(scheduled));
}

const norm = (s) => s.trim().replace(/\s+/g, ' ');
const key = (s) => norm(s).toLowerCase();

// Names are how leads tell operators apart, so two operators can't share one. A new
// operator whose name is taken by someone with a different email gets the next free
// number ("Jordan Pike" -> "Jordan Pike 2"). The same email is the same person, who
// keeps the name already on record.
export function claimName(name, email, people) {
  const wanted = norm(name);
  const mail = email.trim().toLowerCase();
  const same = people.find((p) => p.email === mail);
  if (same) return { name: same.name, email: mail, existing: true, renamed: false };
  const taken = new Set(people.map((p) => key(p.name)));
  if (!taken.has(key(wanted))) return { name: wanted, email: mail, existing: false, renamed: false };
  // Number off the name as it's already spelled on record, whatever case was typed.
  const holder = people.find((p) => key(p.name) === key(wanted)).name;
  const base = holder.replace(/\s+\d+$/, '');
  let n = 2;
  while (taken.has(key(`${base} ${n}`))) n++;
  return { name: `${base} ${n}`, email: mail, existing: false, renamed: true, takenBy: holder };
}
