/**
 * GlassCalendar — animated glass calendar icon (React web).
 *
 * A green back panel with two frosted ring tabs, a mint frosted-glass front panel
 * and a grid of round dots that fill with white one by one, row by row. When the
 * grid is full a check badge pops in, then the grid empties and the loop restarts.
 *
 * Usage:
 *   <GlassCalendar />                         // looping animation, 240 px wide
 *   <GlassCalendar size={96} />               // any size; everything scales
 *   <GlassCalendar progress={8} />            // controlled: show 8 filled dots, no loop
 *   <GlassCalendar onComplete={() => {}} />   // called each time the grid fills
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './GlassCalendar.css';

export type GlassCalendarProps = {
  /** Icon width in px. Height is ~1.02 × width. Default 240. */
  size?: number;
  /** Number of columns in the grid. Default 4. */
  columns?: number;
  /** Total dots in the grid. Default 12 (4 columns × 3 rows). */
  cells?: number;
  /** Delay between dots filling, ms. Default 300. */
  stepMs?: number;
  /** How long a full grid holds before emptying, ms. Default 1400. */
  holdMs?: number;
  /** Pause / resume the loop. Default true. */
  playing?: boolean;
  /** Controlled mode: number of filled dots (0…cells). Disables the loop. */
  progress?: number;
  /** Called each time the grid becomes full. */
  onComplete?: () => void;
  /** Back panel gradient colours, top → bottom. */
  accentColors?: readonly string[];
  /** Tick colour inside the check badge. */
  tickColor?: string;
  /** Accessible label. Default "Calendar progress". */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ACCENT = ['#A6EE92', '#86DE72', '#6ED25E'] as const;
const DRAIN_STAGGER = 25;

export function GlassCalendar({
  size = 240,
  columns = 4,
  cells = 12,
  stepMs = 300,
  holdMs = 1400,
  playing = true,
  progress,
  onComplete,
  accentColors = DEFAULT_ACCENT,
  tickColor = '#3FA34D',
  label = 'Calendar progress',
  className,
  style,
}: GlassCalendarProps) {
  const rows = Math.ceil(cells / columns);
  const controlled = progress !== undefined;

  const [filled, setFilled] = useState(0);
  const [draining, setDraining] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (controlled || !playing) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    (async () => {
      setDraining(false);
      setFilled(0);
      while (!cancelled) {
        for (let n = 1; n <= cells; n++) {
          setFilled(n);
          await wait(stepMs);
          if (cancelled) return;
        }
        onCompleteRef.current?.();
        await wait(holdMs);
        if (cancelled) return;

        setDraining(true); // empty in reverse, then start again
        await wait(cells * DRAIN_STAGGER + 450);
        if (cancelled) return;
        setFilled(0);
        setDraining(false);
        await wait(300);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [controlled, playing, cells, stepMs, holdMs]);

  const shown = controlled ? Math.max(0, Math.min(cells, Math.round(progress))) : filled;
  const done = shown === cells && !draining;

  const rootStyle = {
    '--gc-size': `${size}px`,
    '--gc-back': `linear-gradient(180deg, ${accentColors.join(', ')})`,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={['gc', done && 'gc--done', !playing && !controlled && 'gc--paused', className].filter(Boolean).join(' ')}
      style={rootStyle}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={cells}
      aria-valuenow={shown}
    >
      <div className="gc__back" />
      <span className="gc__ring gc__ring--l" />
      <span className="gc__ring gc__ring--r" />

      <div className="gc__glass">
        <div
          className="gc__grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {Array.from({ length: cells }, (_, i) => (
            <div
              key={i}
              className={['gc__dot', i < shown && 'gc__dot--on', draining && 'gc__dot--out'].filter(Boolean).join(' ')}
              style={draining ? { transitionDelay: `${(cells - 1 - i) * DRAIN_STAGGER}ms` } : undefined}
            />
          ))}
        </div>
      </div>

      <div className="gc__check">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke={tickColor} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default GlassCalendar;
