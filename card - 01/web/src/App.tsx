import { useState } from 'react';
import HomePage from './components/HomePage';
import DealStatus from './components/DealStatus';

/** Preview page for DealStatus on its own: open /?view=deal-status */
function DealStatusPreview() {
  const [run, setRun] = useState(0);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', gap: 16, alignContent: 'center' }}>
      <div style={{ width: 525, height: 496, background: '#fff', boxShadow: '0 0 0 1px #eee' }}>
        <DealStatus key={run} active />
      </div>
      <button onClick={() => setRun((r) => r + 1)}>Replay</button>
    </div>
  );
}

export default function App() {
  const view = new URLSearchParams(window.location.search).get('view');
  return view === 'deal-status' ? <DealStatusPreview /> : <HomePage />;
}
