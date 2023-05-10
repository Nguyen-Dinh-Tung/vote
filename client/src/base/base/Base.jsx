import React from 'react';
import SideBar from '../side-bar/SideBar';
import './index.css';
import Body from '../body/Body';
import Header from '../header/Header';
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
