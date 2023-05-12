import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router';
import { Handle } from './handle';
import { useDispatch } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import { iconSideBarCustom } from './style';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GirlIcon from '@mui/icons-material/Girl';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import BorderColorIcon from '@mui/icons-material/BorderColor';
function SideBar(props) {
  const [target, setTarget] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  Handle.navigate = navigate;
  Handle.setTarget = setTarget;
  Handle.dispatch = dispatch;
  return (
    <div id="side-bar">
      <div id="header-sidve-bar" style={{ justifyContent: 'space-around' }}>
        <div id="side-bar-logo">BDD</div>
        <p id="version">V-1</p>
      </div>
      <div id="side-bar-body">
        <div
          className="side-bar-body-item"
          onClick={Handle.showUsers}
          style={{
            background: target && target === '1' ? '#f4f3f3' : 'white',
            borderLeft: target && target === '1' ? '8px solid' : '',
          }}
        >
          <PersonIcon sx={iconSideBarCustom} />
          Tài khoản
        </div>
        <div
          className="side-bar-body-item"
          onClick={Handle.showCandidate}
          style={{
            background: target && target === '2' ? '#f4f3f3' : 'white',
            borderLeft: target && target === '2' ? '8px solid' : '',
          }}
        >
          <GirlIcon sx={iconSideBarCustom} />
          Thí sinh
        </div>
        <div
          className="side-bar-body-item"
          onClick={Handle.showContest}
          style={{
            background: target && target === '3' ? '#f4f3f3' : 'white',
            borderLeft: target && target === '3' ? '8px solid' : '',
          }}
        >
          <Diversity1Icon sx={iconSideBarCustom} />
          Cuộc thi
        </div>
        <div
          className="side-bar-body-item"
          onClick={Handle.showCompany}
          style={{
            background: target && target === '4' ? '#f4f3f3' : 'white',
            borderLeft: target && target === '4' ? '8px solid' : '',
          }}
        >
          <div className="icons" style={iconSideBarCustom}>
            <ApartmentIcon />
          </div>
          Tổ chức
        </div>
        <div
          className="side-bar-body-item"
          onClick={Handle.showReport}
          style={{
            background: target && target === '5' ? '#f4f3f3' : 'white',
            borderLeft: target && target === '5' ? '8px solid' : '',
          }}
        >
          <BorderColorIcon sx={iconSideBarCustom} />
          Báo cáo
        </div>
      </div>
    </div>
  );
}

export default SideBar;
