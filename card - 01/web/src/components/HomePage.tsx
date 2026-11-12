import { useState } from 'react';
import SlideSheet from './SlideSheet';
import DealStatus from './DealStatus';
import doneIcon from '../../assets/done.svg';
import bg from '../../assets/bg.jpg';
import './HomePage.css';

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reserved, setReserved] = useState(false);

  return (
    <div className="home-page">
      <div className="frame" style={{ backgroundImage: `url(${bg})` }}>
        <div className="frame-content">
          <h1 className="frame-title">Fuji Mountain</h1>
          <p className="frame-description">
            Exploring Mount Fuji is a journey from quiet forest trails to open volcanic slopes.
            The air grows cooler as you climb,
          </p>
          <div className="frame-pills">
            <span className="pill">3N / 4D Stay</span>
            <span className="pill">Guest Favorite</span>
          </div>
          <button
            className={`cta-button${reserved ? ' is-reserved' : ''}`}
            onClick={() => setSheetOpen(true)}
            disabled={reserved}
          >
            {reserved && <img src={doneIcon} alt="" width={28} height={28} />}
            {reserved ? 'Reserved' : 'Reserve Now'}
          </button>
        </div>
        <SlideSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <DealStatus active={sheetOpen} onFinish={() => {
            setSheetOpen(false);
            setReserved(true);
          }} />
        </SlideSheet>
      </div>
    </div>
  );
}
