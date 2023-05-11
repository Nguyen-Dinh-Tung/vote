import React from 'react';
import './index.css';
import { Outlet } from 'react-router';
import Lazyload from '../../components/lazyload/Lazyload';
function Body(props) {
  return (
    <div id="body-content">
      <Outlet />
      <Lazyload />
    </div>
  );
}

export default Body;
