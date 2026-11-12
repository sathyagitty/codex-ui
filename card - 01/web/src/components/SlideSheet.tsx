import type { ReactNode } from 'react';
import closeIcon from '../../assets/x.svg';
import './SlideSheet.css';

type SlideSheetProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export default function SlideSheet({ open, onClose, children }: SlideSheetProps) {
  return (
    <div className={`slide-sheet-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="slide-sheet-scrim" onClick={onClose} />
      <div className="slide-sheet" role="dialog" aria-modal="true">
        <button className="slide-sheet-close" onClick={onClose} aria-label="Close">
          <img src={closeIcon} alt="" width={24} height={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
