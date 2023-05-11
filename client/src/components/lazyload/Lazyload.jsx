import React from 'react';
import './index.css';
import Process from '../process/Process';
import { useSelector } from 'react-redux';
function Lazyload(props) {
  const open = useSelector((state) => state.lazyload.open);
  return (
    <div
      id="lazyload"
      style={{
        display: open && open ? 'block' : 'none',
      }}
    >
      <div className="center-display">
        <Process />
      </div>
    </div>
  );
}

export default Lazyload;
