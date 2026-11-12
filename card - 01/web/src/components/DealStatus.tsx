import { useEffect, useRef, useState } from 'react';
import GlassCalendar from './GlassCalendar';
import './DealStatus.css';

const SPEED = 1.25;
const LOOPS_BEFORE_DONE = 1;
const HOLD_BEFORE_DONE_MS = 1400 / SPEED;

type DealStatusProps = {
  /** True while the sheet is open; restarts the sequence each time. */
  active: boolean;
};

export default function DealStatus({ active }: DealStatusProps) {
  const [done, setDone] = useState(false);
  const loops = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (active) {
      loops.current = 0;
      setDone(false);
    }
    return () => clearTimeout(timer.current);
  }, [active]);

  const handleComplete = () => {
    loops.current += 1;
    if (loops.current === LOOPS_BEFORE_DONE) {
      timer.current = setTimeout(() => setDone(true), HOLD_BEFORE_DONE_MS);
    }
  };

  return (
    <div className={`deal-status${done ? ' is-done' : ''}`}>
      <div className="deal-status__icon">
        <div className="deal-status__calendar">
          <GlassCalendar size={98} playing={active && !done}
            stepMs={300 / SPEED}
            holdMs={1400 / SPEED} onComplete={handleComplete} />
        </div>
        <svg className="deal-status__tick" viewBox="0 0 98 98" fill="none" aria-hidden="true">
          <circle cx="49" cy="49" r="49" fill="#6ED25E" />
          <path
            d="M29 51 L43 65 L69 37"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
        </svg>
      </div>
      <p className="deal-status__text">
        Applying your best deal.
        <br />
        Because little savings matter
      </p>
    </div>
  );
}
