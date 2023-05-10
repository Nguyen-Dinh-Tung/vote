import React from 'react';
import Header from '../header/Header';
import SideBar from '../side-bar/SideBar';
import './index.css';
import Body from '../body/Body';
function Base(props) {
  return (
    <div id="box-container">
      <Header />
      <SideBar />
      <Body />
    </div>
  );
}

export default Base;
