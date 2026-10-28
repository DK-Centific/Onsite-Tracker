import { useEffect, useState } from 'react';
import { fmtClock } from '../lib/time.js';
import { prefersReduced } from '../lib/hooks.js';

// The person's shift so far, against the expected shift length.
export function ShiftRing({ hours, shiftHours, children }) {
  const r = 108;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, hours / shiftHours);
  const [drawn, setDrawn] = useState(prefersReduced() ? p : 0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(p));
    return () => cancelAnimationFrame(id);
  }, [p]);
  const done = hours >= shiftHours;
  return (
    <div className="ring" data-done={done || undefined}>
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <circle className="ring-track" cx="120" cy="120" r={r} />
        <circle
          className="ring-fill"
          cx="120" cy="120" r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - drawn)}
          transform="rotate(-90 120 120)"
        />
      </svg>
      <div className="ring-center">
        <span className="ring-time">{fmtClock(hours)}</span>
        <span className="ring-of">{done ? 'shift complete' : `of ${fmtClock(shiftHours)} shift`}</span>
        {children}
      </div>
    </div>
  );
}
