import React from 'react';
import './index.css';
import { Outlet } from 'react-router';
function Body(props) {
  return (
    <div id="body-content">
      <Outlet />
    </div>
  );
}

export default Body;
