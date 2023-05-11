import React, { useEffect, useState } from 'react';
import './index.css';
import { Avatar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { avatarStyle, exitIconStyle, headerStyle } from './style';
import { useSelector } from 'react-redux';
function Header(props) {
  const [user, setUser] = useState();
  const title = useSelector((state) => state.titleSideBar.title);
  useEffect(() => {});
  return (
    <div id="header">
      <p id="now-page">{title && title}</p>
      <div className="side-bar-feature" style={headerStyle}>
        <Avatar
          alt="Remy Sharp"
          sx={avatarStyle}
          src={
            user && user['background']
              ? process.env.REACT_APP_HOST_BACK_END + user['background']
              : ''
          }
        />
        <ExitToAppIcon sx={exitIconStyle} />
      </div>
    </div>
  );
}

export default Header;
