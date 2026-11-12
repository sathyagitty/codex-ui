import { useEffect, useRef, useState, type CSSProperties } from 'react';
import GlassCalendar from './GlassCalendar';
import './DealStatus.css';

const SPEED = 1.25;
const LOOPS_BEFORE_DONE = 1;
const HOLD_BEFORE_DONE_MS = 1400 / SPEED;
const TICK_END_MS = 1200; // tick stroke finishes 1.2s after the done state starts
const CLOSE_DELAY_MS = 400;

type DealStatusProps = {
  /** True while the sheet is open; restarts the sequence each time. */
  active: boolean;
  /** Called once the tick has finished drawing (+ a short beat). */
  onFinish?: () => void;
};

export default function DealStatus({ active, onFinish }: DealStatusProps) {
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

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => onFinishRef.current?.(), TICK_END_MS + CLOSE_DELAY_MS);
    return () => clearTimeout(id);
  }, [done]);

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
        <div className="deal-status__rays" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={`deal-status__ray${i % 2 ? ' is-dot' : ''}`}
              style={{ '--a': `${i * 30}deg` } as CSSProperties}
            />
          ))}
        </div>
        <svg className="deal-status__tick" viewBox="0 0 98 98" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="ds-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#A6EE92" />
              <stop offset="1" stopColor="#92E47E" />
            </linearGradient>
            <linearGradient id="ds-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#BEEEB2" stopOpacity="0.7" />
              <stop offset="0.45" stopColor="#D4F3CC" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ECFAE8" stopOpacity="0.92" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="56" r="40" fill="url(#ds-green)" />
          <circle cx="56" cy="42" r="39" fill="url(#ds-glass)" stroke="#fff" strokeOpacity="0.85" />
          <path
            d="M39 44 L50 55 L72 32"
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
