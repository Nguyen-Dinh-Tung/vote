import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router';
import { Handle } from './handle';
import { useDispatch } from 'react-redux';

function SideBar(props) {
  const [target, setTarget] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    Handle.navigate = navigate;
    Handle.setTarget = setTarget;
    Handle.dispatch = dispatch;
  }, []);
  return (
    <div id="side-bar">
      <div id="header-sidve-bar" style={{ justifyContent: 'space-around' }}>
        <div id="side-bar-logo">BDD</div>
        <p id="version">V-1</p>
      </div>
      <div id="side-bar-body">
        <div
          className="side-bar-body-item"
          onClick={Handle.showCandidate}
          style={{
            background: target && target === '1' ? '#ccc' : 'white',
          }}
        >
          Thí sinh
        </div>
        <div
          className="side-bar-body-item"
          onClick={Handle.showContest}
          style={{
            background: target && target === '2' ? '#ccc' : 'white',
          }}
        >
          Cuộc thi
        </div>
        <div
          className="side-bar-body-item"
          onClick={Handle.showCompany}
          style={{
            background: target && target === '3' ? '#ccc' : 'white',
          }}
        >
          Tổ chức
        </div>
      </div>
    </div>
  );
}

export default SideBar;
