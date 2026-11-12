import { useState } from 'react';
import './Card.css';

type ButtonState = 'idle' | 'loading' | 'done';

const LABELS: Record<ButtonState, string> = {
  idle: 'Reserve Now',
  loading: 'Reserving...',
  done: 'Reserved',
};

export default function Card() {
  const [state, setState] = useState<ButtonState>('idle');

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('loading');
    // Placeholder for the real action (API call, animation, etc.)
    setTimeout(() => setState('done'), 1500);
  };

  return (
    <div className="card">
      <button
        className={`card-button card-button--${state}`}
        onClick={handleClick}
        disabled={state === 'loading'}
      >
        {LABELS[state]}
      </button>
    </div>
  );
}
